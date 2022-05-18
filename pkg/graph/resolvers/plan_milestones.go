package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UpdatePlanMilestones implements resolver logic to update a plan milestones object
func UpdatePlanMilestones(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal string, store *storage.Store) (*models.PlanMilestones, error) {
	// Get existing milestones
	existingMilestones, err := store.FetchPlanMilestonesByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = ApplyChanges(changes, existingMilestones)
	if err != nil {
		return nil, err
	}
	existingMilestones.ModifiedBy = &principal
	existingMilestones.CalcStatus()

	result, err := store.PlanMilestonesUpdate(logger, existingMilestones)
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
