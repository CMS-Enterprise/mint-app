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
	existing, err := store.FetchPlanMilestonesByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(existing, changes, principal)
	if err != nil {
		return nil, err
	}

	result, err := store.PlanMilestonesUpdate(logger, existing)
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
