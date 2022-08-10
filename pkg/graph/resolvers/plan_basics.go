package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UpdatePlanBasics implements resolver logic to update a plan basics object
func UpdatePlanBasics(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanBasics, error) {
	// Get existing basics
	existing, err := store.PlanBasicsGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(existing, changes, principal)
	if err != nil {
		return nil, err
	}

	retBasics, err := store.PlanBasicsUpdate(logger, existing)
	return retBasics, err
}

// PlanBasicsGetByModelPlanID implements resolver logic to get plan basics by a model plan ID
func PlanBasicsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
	plan, err := store.PlanBasicsGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	return plan, nil
}
