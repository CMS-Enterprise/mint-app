package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
	"github.com/cmsgov/mint-app/pkg/upload"
)

func createDocumentPayload(s3Client *upload.S3Client, document *models.PlanDocument) (*model.PlanDocumentPayload, error) {
	presignedURL, urlErr := s3Client.NewGetPresignedURL(document.FileKey)
	if urlErr != nil {
		return nil, urlErr
	}

	payload := model.PlanDocumentPayload{
		Document:     document,
		PresignedURL: presignedURL,
	}

	return &payload, nil
}

// PlanDocumentCreate implements resolver logic to create a plan document object
func PlanDocumentCreate(
	logger *zap.Logger,
	document *models.PlanDocument,
	documentURL *string,
	principal authentication.Principal,
	store *storage.Store,
	s3Client *upload.S3Client) (*model.PlanDocumentPayload, error) {

	err := BaseStructPreCreate(logger, document, principal, store)
	if err != nil {
		return nil, err
	}

	document, err = store.PlanDocumentCreate(logger, principal.ID(), document, documentURL, s3Client)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, document)
	}

	return createDocumentPayload(s3Client, document)
}

// PlanDocumentRead implements resolver logic to fetch a plan document object by ID
func PlanDocumentRead(logger *zap.Logger, store *storage.Store, s3Client *upload.S3Client, id uuid.UUID) (*models.PlanDocument, error) {
	document, err := store.PlanDocumentRead(logger, s3Client, id)
	if err != nil {
		return nil, err
	}

	return document, nil
}

// PlanDocumentsReadByModelPlanID implements resolver logic to fetch a plan document object by model plan ID
func PlanDocumentsReadByModelPlanID(logger *zap.Logger, id uuid.UUID, store *storage.Store, s3Client *upload.S3Client) ([]*models.PlanDocument, error) {
	documents, err := store.PlanDocumentsReadByModelPlanID(logger, id, s3Client)
	if err != nil {
		return nil, err
	}

	return documents, nil
}

// PlanDocumentUpdate implements resolver logic to update a plan milestones object
func PlanDocumentUpdate(logger *zap.Logger, s3Client *upload.S3Client, input *models.PlanDocument, principal authentication.Principal, store *storage.Store) (*model.PlanDocumentPayload, error) {

	existingdoc, err := store.PlanDocumentRead(logger, s3Client, input.ID)
	if err != nil {
		return nil, err
	}
	input.ModelPlanID = existingdoc.ModelPlanID

	err = BaseStructPreUpdate(logger, input, nil, principal, store, false)
	if err != nil {
		return nil, err
	}
	// //TODO convert to use Apply Changes and Base Struct pre-update

	document, err := store.PlanDocumentUpdate(logger, input)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, input)
	}

	return createDocumentPayload(s3Client, document)
}

// PlanDocumentDelete implements resolver logic to update a plan document object
func PlanDocumentDelete(logger *zap.Logger, s3Client *upload.S3Client, input *models.PlanDocument, principal authentication.Principal, store *storage.Store) (int, error) {
	euaid := principal.ID()
	input.ModifiedBy = &euaid

	existingdoc, err := store.PlanDocumentRead(logger, s3Client, input.ID)
	if err != nil {
		return 0, err
	}
	err = BaseStructPreDelete(logger, existingdoc, principal, store)
	if err != nil {
		return 0, err
	}

	sqlResult, err := store.PlanDocumentDelete(logger, input.ID)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := sqlResult.RowsAffected()
	return int(rowsAffected), err
}
