package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// CTATRequestGetByRequesterIDLOADER implements resolver logic to get CTAT requests by requester ID using a data loader.
func CTATRequestGetByRequesterIDLOADER(ctx context.Context, requesterID uuid.UUID) ([]*models.CTATRequest, error) {
	return loaders.CTATRequest.ByRequesterID.Load(ctx, requesterID)
}

// CTATRequestCollectionGetAll implements resolver logic to get CTAT requests for the admin table view.
func CTATRequestCollectionGetAll(ctx context.Context) ([]*models.CTATRequest, error) {
	return loaders.CTATRequest.GetAll.Load(ctx, nil)
}

// CTATRequestGetByID implements resolver logic to get a CTAT request by ID.
func CTATRequestGetByID(ctx context.Context, id uuid.UUID) (*models.CTATRequest, error) {
	return loaders.CTATRequest.GetByID.Load(ctx, id)
}

// CTATRequestAdminUpdate implements resolver logic to update admin-managed CTAT request fields.
func CTATRequestAdminUpdate(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]any,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.CTATRequest, error) {
	if !principal.AllowASSESSMENT() {
		return nil, fmt.Errorf("user does not have permission to update admin CTAT requests")
	}

	existing, err := CTATRequestGetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if existing == nil {
		return nil, fmt.Errorf("ctat request with id %s not found", id.String())
	}

	originalRequest := *existing

	// handle this separately as needs some custom work
	if rawAssignedAdmin, ok := changes["assignedAdmin"]; ok {
		assignedAdminUsername, ok := rawAssignedAdmin.(*string)
		if !ok {
			return nil, fmt.Errorf("assignedAdmin must be a string")
		}

		if assignedAdminUsername == nil {
			existing.AssignedAdmin = nil
		} else {
			assignedAdminAccount, err := userhelpers.GetOrCreateUserAccount(
				ctx,
				store,
				store,
				*assignedAdminUsername,
				false,
				false,
				getAccountInformation,
			)
			if err != nil {
				return nil, fmt.Errorf(
					"failed to get user account by username %s: %w",
					*assignedAdminUsername,
					err,
				)
			}

			existing.AssignedAdmin = &assignedAdminAccount.ID
		}
	}

	// remove from map to avoid any issues in `ApplyChanges`
	delete(changes, "assignedAdmin")

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	updatedRequest, err := storage.CTATRequestAdminUpdate(store, existing)
	if err != nil {
		return nil, err
	}

	if emailService != nil {
		go func() {
			sendEmailErr := email.SendCTATUpdateEmail(
				ctx,
				emailService,
				addressBook,
				&originalRequest,
				updatedRequest,
				CTATRelatedMINTModelsGetByCTATRequestIDLOADER,
				CTATRequestDocumentGetByCTATRequestIDLOADER,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send CTAT update email",
					zap.String("ctatRequestID", updatedRequest.ID.String()),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return updatedRequest, nil
}

// CTATRequestDocumentGetByCTATRequestIDLOADER resolves CTAT request documents by CTAT request ID using a data loader.
func CTATRequestDocumentGetByCTATRequestIDLOADER(ctx context.Context, ctatRequestID uuid.UUID) ([]*models.CTATRequestDocument, error) {
	documents, err := loaders.CTATRequestDocument.ByCTATRequestID.Load(ctx, ctatRequestID)
	if err != nil {
		return nil, err
	}
	if documents == nil {
		return []*models.CTATRequestDocument{}, nil
	}

	return documents, nil
}

// CTATRelatedMINTModelsGetByCTATRequestIDLOADER resolves CTAT-related MINT model plans for a CTAT request using loaders.
func CTATRelatedMINTModelsGetByCTATRequestIDLOADER(ctx context.Context, ctatRequestID uuid.UUID) ([]*models.ModelPlan, error) {
	plans, err := loaders.ModelPlan.ByCTATRequestID.Load(ctx, ctatRequestID)
	if err != nil {
		return nil, err
	}
	if plans == nil {
		return []*models.ModelPlan{}, nil
	}

	return plans, nil
}

// CTATRequestCreate implements resolver logic to create a CTAT request, related model links,
// and supporting document metadata after uploading any files to S3.
func CTATRequestCreate(
	ctx context.Context,
	logger *zap.Logger,
	input *model.CTATRequestInput,
	principal authentication.Principal,
	store *storage.Store,
	s3Client *s3.S3Client,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) (*models.CTATRequest, error) {
	if !principal.AllowUSER() {
		return nil, fmt.Errorf("user does not have permission to create CTAT requests")
	}

	request := newCTATRequest(input, principal.Account().ID)
	relatedModelIDs := lo.Uniq(input.RelatedMINTModels)
	relatedModelLinks := models.NewCTATRequestModelPlanLinks(request.ID, relatedModelIDs, principal.Account().ID)
	supportingDocuments, err := newCTATRequestDocuments(input.SupportingDocuments, request.ID, principal.Account().ID, *s3Client.GetBucket())
	if err != nil {
		return nil, err
	}

	err = BaseStructPreCreate(logger, request, principal, store, false)
	if err != nil {
		return nil, err
	}

	for _, document := range supportingDocuments {
		err = s3Client.UploadFile(ctx, document.upload.FileData.File, document.FileKey)
		if err != nil {
			return nil, err
		}
	}

	createdRequest, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.CTATRequest, error) {
		createdRequest, err := storage.CTATRequestCreate(tx, request)
		if err != nil {
			return nil, err
		}

		for _, relatedModelLink := range relatedModelLinks {
			_, err = storage.CTATRequestModelPlanLinkCreate(tx, relatedModelLink)
			if err != nil {
				return nil, err
			}
		}

		for _, document := range supportingDocuments {
			_, err = storage.CTATRequestDocumentCreate(tx, &document.CTATRequestDocument)
			if err != nil {
				return nil, err
			}
		}

		return createdRequest, nil
	})
	if err != nil {
		return nil, err
	}

	if emailService != nil {
		go func() {
			sendEmailErr := email.SendCTATSubmittedEmail(
				ctx,
				emailService,
				addressBook,
				createdRequest,
				CTATRelatedMINTModelsGetByCTATRequestIDLOADER,
				CTATRequestDocumentGetByCTATRequestIDLOADER,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send CTAT submitted email",
					zap.String("ctatRequestID", createdRequest.ID.String()),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return createdRequest, nil
}

type ctatRequestDocumentUpload struct {
	models.CTATRequestDocument
	upload model.CTATRequestDocumentInput
}

func newCTATRequest(input *model.CTATRequestInput, requesterID uuid.UUID) *models.CTATRequest {
	request := models.NewCTATRequest(requesterID, requesterID)
	request.ID = uuid.New()
	request.CmmiGroup = input.CmmiGroup
	request.CmmiGroupOther = input.CmmiGroupOther
	request.CmmiDivision = input.CmmiDivision
	request.CmmiDivisionOther = input.CmmiDivisionOther
	request.ContractActivityType = input.ContractActivityType
	request.ContractActivityTypeOther = input.ContractActivityTypeOther
	request.ContractName = input.ContractName
	request.ContractNumber = input.ContractNumber
	request.ContractType = input.ContractType
	request.ContractTypeOther = input.ContractTypeOther
	request.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType](input.TypeOfHelpNeeded)
	request.TypeOfHelpNeededOther = input.TypeOfHelpNeededOther
	request.DescribeHelpNeeded = input.DescribeHelpNeeded
	request.RequestUrgency = input.RequestUrgency
	request.DateAssistanceNeededBy = input.DateAssistanceNeededBy

	return request
}

func newCTATRequestDocuments(
	inputs []*model.CTATRequestDocumentInput,
	ctatRequestID uuid.UUID,
	createdBy uuid.UUID,
	bucket string,
) ([]*ctatRequestDocumentUpload, error) {
	documents := make([]*ctatRequestDocumentUpload, 0, len(inputs))

	for _, input := range inputs {
		if input == nil {
			return nil, fmt.Errorf("ctat supporting document input cannot be nil")
		}

		document := &ctatRequestDocumentUpload{
			CTATRequestDocument: models.CTATRequestDocument{
				URL:          nil,
				FileType:     input.FileData.ContentType,
				Bucket:       bucket,
				FileKey:      fmt.Sprintf("ctat/%s/%s", ctatRequestID.String(), uuid.NewString()),
				VirusScanned: false,
				VirusClean:   false,
				Restricted:   false,
				FileName:     input.FileData.Filename,
				FileSize:     int(input.FileData.Size),
			},
			upload: *input,
		}
		document.ID = uuid.New()
		document.CTATRequestID = ctatRequestID
		document.CreatedBy = createdBy

		documents = append(documents, document)
	}

	return documents, nil
}
