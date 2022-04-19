package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func CreatePlanMilestonesResolver(logger *zap.Logger, input *models.PlanMilestones, principal *string, store *storage.Store) (*models.PlanMilestones, error) {
	input.CreatedBy = principal
	input.ModifiedBy = input.CreatedBy

	result, err := store.PlanMilestonesCreate(logger, input)
	return result, err
}

func UpdatePlanMilestonesResolver(logger *zap.Logger, input *models.PlanMilestones, principal *string, store *storage.Store) (*models.PlanMilestones, error) {
	input.ModifiedBy = principal

	result, err := store.PlanMilestonesUpdate(logger, input)
	return result, err
}

func FetchPlanMilestonesByModelPlanID(logger *zap.Logger, principal *string, id uuid.UUID, store *storage.Store) (*models.PlanMilestones, error) {
	plan, err := store.FetchPlanMilestonesByModelPlanID(logger, principal, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}

func FetchPlanMilestonesByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanMilestones, error) {
	plan, err := store.FetchPlanMilestonesByID(logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}
