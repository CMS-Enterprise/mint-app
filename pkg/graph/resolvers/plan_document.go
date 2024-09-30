package resolvers

import (
	"fmt"
	"net/url"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/accesscontrol"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/s3"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"
)

// PlanDocumentCreate implements resolver logic to upload the specified file to S3 and create a matching plan document entity in the database.
func PlanDocumentCreate(logger *zap.Logger, input *model.PlanDocumentInput, principal authentication.Principal, store *storage.Store, s3Client *s3.S3Client) (*models.PlanDocument, error) {
	document := models.NewPlanDocument(principal.Account().ID, input.ModelPlanID, input.FileData.ContentType, *s3Client.GetBucket(), uuid.NewString(), input.FileData.Filename, int(input.FileData.Size), input.DocumentType, input.Restricted, zero.StringFromPtr(input.OtherTypeDescription), zero.StringFromPtr(input.OptionalNotes), false, zero.String{})

	err := BaseStructPreCreate(logger, document, principal, store, true)
	if err != nil {
		return nil, err
	}

	err = s3Client.UploadFile(input.FileData.File, document.FileKey)
	if err != nil {
		return &models.PlanDocument{}, err
	}

	document, err = store.PlanDocumentCreate(logger, principal.ID(), document)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, document)
	}

	return document, nil
}

// PlanDocumentCreateLinked creates a plan document which is a link to an external URL instead of an Uploaded file
func PlanDocumentCreateLinked(logger *zap.Logger, input model.PlanDocumentLinkInput, principal authentication.Principal, store *storage.Store) (*models.PlanDocument, error) {
	contentType := "externalLink"
	fileSize := 0
	u, err := url.Parse(input.URL)
	if err != nil {
		return nil, fmt.Errorf(" url is not in a valid format. err : %w", err)
	}
	// Ensure the URL has a host specified and is not a relative link
	if u.Host == "" {
		return nil, fmt.Errorf(" url does not have a host specified. Please create a valid absolute reference. url : %s ", input.URL)
	}

	// Ensure the URL has a scheme of either http or https
	if u.Scheme != "http" && u.Scheme != "https" {
		return nil, fmt.Errorf(" url does not have a valid scheme. It should begin with http or https. url : %s ", input.URL)
	}
	document := models.NewPlanDocument(principal.Account().ID, input.ModelPlanID, contentType, contentType, contentType, input.Name, fileSize, input.DocumentType, input.Restricted, zero.StringFromPtr(input.OtherTypeDescription), zero.StringFromPtr(input.OptionalNotes), true, zero.StringFrom(input.URL))

	err = BaseStructPreCreate(logger, document, principal, store, true)
	if err != nil {
		return nil, err
	}

	document, err = store.PlanDocumentCreate(logger, principal.ID(), document)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, document)
	}

	return document, nil
}

// PlanDocumentRead implements resolver logic to fetch a plan document object by ID
func PlanDocumentRead(logger *zap.Logger, store *storage.Store, s3Client *s3.S3Client, id uuid.UUID) (*models.PlanDocument, error) {
	document, err := store.PlanDocumentRead(logger, s3Client, id)
	if err != nil {
		return nil, err
	}

	return document, nil
}

// PlanDocumentsReadByModelPlanID implements resolver logic to fetch a plan document object by model plan ID
func PlanDocumentsReadByModelPlanID(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store, s3Client *s3.S3Client) ([]*models.PlanDocument, error) {

	isCollaborator, err := accesscontrol.IsCollaboratorModelPlanID(logger, principal, store, id)
	if err != nil {
		return nil, err
	}
	//Future Enhancement refactor this to use HasPrivilegedDocumentAccessByModelPlanID

	// Non-collaborators OR anyone with the Non-CMS User job code cannot see restricted documents
	if !isCollaborator || principal.AllowNonCMSUser() {
		notRestrictedDocuments, err := store.PlanDocumentsReadByModelPlanIDNotRestricted(logger, id, s3Client)

		if err != nil {
			return nil, err
		}

		return notRestrictedDocuments, nil
	}

	documents, docErr := store.PlanDocumentsReadByModelPlanID(logger, id, s3Client)

	if docErr != nil {
		return nil, docErr
	}
	return documents, nil

}

// PlanDocumentsReadBySolutionID implements resolver logic to fetch a plan document object by solution ID
func PlanDocumentsReadBySolutionID(
	logger *zap.Logger,
	id uuid.UUID,
	principal authentication.Principal,
	store *storage.Store,
	s3Client *s3.S3Client,
) ([]*models.PlanDocument, error) {

	isCollaborator, err := accesscontrol.IsCollaboratorSolutionID(logger, principal, store, id)
	if err != nil {
		return nil, err
	}

	// Non-collaborators OR anyone with the Non-CMS User job code cannot see restricted documents
	if !isCollaborator || principal.AllowNonCMSUser() {
		notRestrictedDocuments, err := store.PlanDocumentsReadBySolutionIDNotRestricted(logger, id, s3Client)

		if err != nil {
			return nil, err
		}

		return notRestrictedDocuments, nil
	}

	documents, docErr := store.PlanDocumentsReadBySolutionID(logger, id, s3Client)

	if docErr != nil {
		return nil, docErr
	}
	return documents, nil
}

// PlanDocumentDelete implements resolver logic to update a plan document object
func PlanDocumentDelete(logger *zap.Logger, s3Client *s3.S3Client, id uuid.UUID, principal authentication.Principal, store *storage.Store) (int, error) {
	existingdoc, err := store.PlanDocumentRead(logger, s3Client, id)
	if err != nil {
		return 0, err
	}
	err = BaseStructPreDelete(logger, existingdoc, principal, store, true)
	if err != nil {
		return 0, err
	}

	sqlResult, err := store.PlanDocumentDelete(logger, id, principal.Account().ID)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := sqlResult.RowsAffected()
	return int(rowsAffected), err
}
