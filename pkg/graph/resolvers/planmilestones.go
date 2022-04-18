package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"
)

func CreatePlanMilestonesResolver(logger *zap.Logger, input model.CreatePlanMilestonesRequest, principal string, store *storage.Store) (*model.CreatePlanMilestonesPayload, error) {
	plan := models.PlanMilestones{
		CreatedBy: null.StringFrom(principal),
		ID:        input.ModelPlanID,
	}

	plan.ModifiedBy = plan.CreatedBy
	createdPlan, err := store.PlanMilestonesCreate(logger, &plan)

	payload := model.CreatePlanMilestonesPayload{
		ID:         createdPlan.ID,
		UserErrors: nil,
	}
	return &payload, err
}

func FetchPlanMilestonesByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanMilestones, error) {
	plan, err := store.PlanMilestonesGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}
