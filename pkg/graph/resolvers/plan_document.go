package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
	"github.com/cmsgov/mint-app/pkg/upload"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func createDocumentPayload(s3Client *upload.S3Client, document *models.PlanDocument) (*model.PlanDocumentPayload, error) {
	presignedURL, urlErr := s3Client.NewGetPresignedURL(*document.FileKey)
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
	principal *string,
	store *storage.Store,
	s3Client *upload.S3Client) (*model.PlanDocumentPayload, error) {
	document, err := store.PlanDocumentCreate(logger, principal, document, documentURL, s3Client)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, models.PlanDocument{ID: document.ID})
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
func PlanDocumentUpdate(logger *zap.Logger, s3Client *upload.S3Client, input *models.PlanDocument, principal *string, store *storage.Store) (*model.PlanDocumentPayload, error) {
	input.ModifiedBy = principal

	document, err := store.PlanDocumentUpdate(logger, input)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, input)
	}

	return createDocumentPayload(s3Client, document)
}

// PlanDocumentDelete implements resolver logic to update a plan document object
func PlanDocumentDelete(logger *zap.Logger, input *models.PlanDocument, principal *string, store *storage.Store) (int, error) {
	input.ModifiedBy = principal

	sqlResult, err := store.PlanDocumentDelete(logger, input.ID)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := sqlResult.RowsAffected()
	return int(rowsAffected), err
}
