package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// CTATRequestGetByRequesterIDLOADER implements resolver logic to get CTAT requests by requester ID using a data loader.
func CTATRequestGetByRequesterIDLOADER(ctx context.Context, requesterID uuid.UUID) ([]*models.CTATRequest, error) {
	return loaders.CTATRequest.ByRequesterID.Load(ctx, requesterID)
}

// CTATRequestCollectionGetForAdmin implements resolver logic to get CTAT requests for the admin table view.
func CTATRequestCollectionGetForAdmin(ctx context.Context, store *storage.Store) ([]*models.CTATRequest, error) {
	return storage.CTATRequestCollectionGetForAdmin(store)
}

// CTATRequestGetByID implements resolver logic to get a CTAT request by ID.
func CTATRequestGetByID(ctx context.Context, id uuid.UUID, _ *storage.Store) (*models.CTATRequest, error) {
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
) (*models.CTATRequest, error) {
	if !principal.AllowASSESSMENT() {
		return nil, fmt.Errorf("user does not have permission to update admin CTAT requests")
	}

	existing, err := CTATRequestGetByID(ctx, id, store)
	if err != nil {
		return nil, err
	}

	if existing == nil {
		return nil, fmt.Errorf("ctat request with id %s not found", id.String())
	}

	if rawStatus, ok := changes["status"]; ok {
		status, ok := rawStatus.(*models.CTATStatus)
		if !ok {
			return nil, fmt.Errorf("status must be a CTATStatus")
		}

		if status != nil {
			existing.Status = *status
		}
	}

	if rawAssignedAdmin, ok := changes["assignedAdmin"]; ok {
		assignedAdminUsername, ok := rawAssignedAdmin.(*string)
		if !ok {
			return nil, fmt.Errorf("assignedAdmin must be a string")
		}

		if assignedAdminUsername == nil {
			existing.AssignedAdmin = nil
		} else {
			assignedAdminAccount, err := UserAccountGetByUsername(logger, store, *assignedAdminUsername)
			if err != nil {
				return nil, err
			}

			if assignedAdminAccount == nil {
				return nil, fmt.Errorf("user account not found for username %s", *assignedAdminUsername)
			}

			assignedAdminID := assignedAdminAccount.ID
			existing.AssignedAdmin = &assignedAdminID
		}
	}

	if rawNotes, ok := changes["notes"]; ok {
		notes, ok := rawNotes.(*string)
		if !ok {
			return nil, fmt.Errorf("notes must be a string")
		}

		existing.Notes = zero.StringFromPtr(notes)
	}

	if rawResolution, ok := changes["resolution"]; ok {
		resolution, ok := rawResolution.(*string)
		if !ok {
			return nil, fmt.Errorf("resolution must be a string")
		}

		existing.Resolution = zero.StringFromPtr(resolution)
	}

	err = BaseStructPreUpdate(logger, existing, nil, principal, store, false, false)
	if err != nil {
		return nil, err
	}

	return storage.CTATRequestAdminUpdate(store, existing)
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
	links, err := loaders.CTATRequestModelPlanLink.ByCTATRequestID.Load(ctx, ctatRequestID)
	if err != nil {
		return nil, err
	}
	if len(links) == 0 {
		return []*models.ModelPlan{}, nil
	}

	ids := make([]uuid.UUID, len(links))
	for i, link := range links {
		ids[i] = link.ModelPlanID
	}

	plans, errs := loaders.ModelPlan.GetByID.LoadMany(ctx, ids)
	for _, err := range errs {
		if err != nil {
			return nil, err
		}
	}

	relatedModels := make([]*models.ModelPlan, 0, len(plans))
	for _, plan := range plans {
		if plan == nil {
			return nil, fmt.Errorf("model plan not found while resolving CTAT related MINT models")
		}

		relatedModels = append(relatedModels, plan)
	}

	return relatedModels, nil
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
) (*models.CTATRequest, error) {
	if !principal.AllowUSER() {
		return nil, fmt.Errorf("user does not have permission to create CTAT requests")
	}

	request := newCTATRequest(input, principal.Account().ID)
	relatedModelIDs := lo.Uniq(input.RelatedMINTModels)
	relatedModelLinks := newCTATRequestModelPlanLinks(request.ID, relatedModelIDs, principal.Account().ID)
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

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.CTATRequest, error) {
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
}

type ctatRequestDocumentUpload struct {
	models.CTATRequestDocument
	upload model.CTATRequestDocumentInput
}

func newCTATRequest(input *model.CTATRequestInput, requesterID uuid.UUID) *models.CTATRequest {
	request := models.NewCTATRequest(requesterID, requesterID)
	request.ID = uuid.New()
	request.CmmiGroup = input.CmmiGroup
	request.CmmiGroupOther = zero.StringFromPtr(input.CmmiGroupOther)
	request.CmmiDivision = input.CmmiDivision
	request.CmmiDivisionOther = zero.StringFromPtr(input.CmmiDivisionOther)
	request.ContractActivityType = input.ContractActivityType
	request.ContractActivityTypeOther = zero.StringFromPtr(input.ContractActivityTypeOther)
	request.ContractName = zero.StringFromPtr(input.ContractName)
	request.ContractNumber = zero.StringFromPtr(input.ContractNumber)
	request.ContractType = input.ContractType
	request.ContractTypeOther = zero.StringFromPtr(input.ContractTypeOther)
	request.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType](input.TypeOfHelpNeeded)
	request.TypeOfHelpNeededOther = zero.StringFromPtr(input.TypeOfHelpNeededOther)
	request.DescribeHelpNeeded = input.DescribeHelpNeeded
	request.RequestUrgency = input.RequestUrgency
	request.DateAssistanceNeededBy = input.DateAssistanceNeededBy

	return request
}

func newCTATRequestModelPlanLinks(ctatRequestID uuid.UUID, modelPlanIDs []uuid.UUID, createdBy uuid.UUID) []*models.CTATRequestModelPlanLink {
	links := make([]*models.CTATRequestModelPlanLink, 0, len(modelPlanIDs))

	for _, modelPlanID := range modelPlanIDs {
		link := &models.CTATRequestModelPlanLink{}
		link.ID = uuid.New()
		link.CTATRequestID = ctatRequestID
		link.ModelPlanID = modelPlanID
		link.CreatedBy = createdBy

		links = append(links, link)
	}

	return links
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
