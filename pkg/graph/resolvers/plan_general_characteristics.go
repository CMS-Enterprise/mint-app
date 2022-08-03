package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UpdatePlanGeneralCharacteristics implements resolver logic to update a plan general characteristics object
func UpdatePlanGeneralCharacteristics(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal string, store *storage.Store) (*models.PlanGeneralCharacteristics, error) {
	// Get existing plan general characteristics
	existing, err := store.PlanGeneralCharacteristicsGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(existing, changes, principal)
	if err != nil {
		return nil, err
	}

	retGeneralCharacteristics, err := store.PlanGeneralCharacteristicsUpdate(logger, existing)
	return retGeneralCharacteristics, err
}

// FetchPlanGeneralCharacteristicsByModelPlanID implements resolver logic to
// get a plan general characteristics object by a model plan ID
func FetchPlanGeneralCharacteristicsByModelPlanID(logger *zap.Logger, principal string, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanGeneralCharacteristics, error) {
	gc, err := store.PlanGeneralCharacteristicsGetByModelPlanID(logger, principal, modelPlanID)
	if err != nil {
		return nil, err
	}

	return gc, nil
}
