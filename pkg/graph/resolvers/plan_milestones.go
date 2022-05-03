package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanMilestones implements resolver logic to create a plan milestones object
func CreatePlanMilestones(logger *zap.Logger, input *models.PlanMilestones, principal *string, store *storage.Store) (*models.PlanMilestones, error) {
	input.CreatedBy = principal
	input.ModifiedBy = input.CreatedBy

	result, err := store.PlanMilestonesCreate(logger, input)
	return result, err
}

// UpdatePlanMilestones implements resolver logic to update a plan milestones object
func UpdatePlanMilestones(logger *zap.Logger, input *models.PlanMilestones, principal *string, store *storage.Store) (*models.PlanMilestones, error) {
	input.ModifiedBy = principal

	result, err := store.PlanMilestonesUpdate(logger, input)
	return result, err
}

// FetchPlanMilestonesByModelPlanID implements resolver logic to fetch a plan milestones object by model plan ID
func FetchPlanMilestonesByModelPlanID(logger *zap.Logger, principal *string, id uuid.UUID, store *storage.Store) (*models.PlanMilestones, error) {
	plan, err := store.FetchPlanMilestonesByModelPlanID(logger, principal, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}

// FetchPlanMilestonesByID implements resolver logic to fetch a plan milestones object by ID
func FetchPlanMilestonesByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanMilestones, error) {
	plan, err := store.FetchPlanMilestonesByID(logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}
