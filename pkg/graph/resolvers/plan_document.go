package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// PlanDocumentCreate implements resolver logic to create a plan document object
func PlanDocumentCreate(logger *zap.Logger, input *models.PlanDocument, principal *string, store *storage.Store) (*models.PlanDocument, error) {
	input.CreatedBy = principal
	input.ModifiedBy = input.CreatedBy

	document, err := store.PlanDocumentCreate(logger, input)
	return document, err
}

// PlanDocumentRead implements resolver logic to fetch a plan document object by ID
func PlanDocumentRead(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanDocument, error) {
	document, err := store.PlanDocumentRead(logger, id)
	if err != nil {
		return nil, err
	}

	return document, nil
}

// PlanDocumentReadByModelPlanID implements resolver logic to fetch a plan document object by model plan ID
func PlanDocumentReadByModelPlanID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanDocument, error) {
	document, err := store.PlanDocumentReadByModelPlanID(logger, id)
	if err != nil {
		return nil, err
	}

	return document, nil
}

// PlanDocumentUpdate implements resolver logic to update a plan milestones object
func PlanDocumentUpdate(logger *zap.Logger, input *models.PlanDocument, principal *string, store *storage.Store) (*models.PlanDocument, error) {
	input.ModifiedBy = principal

	result, err := store.PlanDocumentUpdate(logger, input)
	return result, err
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
