package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"github.com/guregu/null"
	"go.uber.org/zap"
)

func CreatePlanBasicsResolver(logger *zap.Logger, input model.CreatePlanBasicsRequestInput, principal string, store *storage.Store) (*model.CreatePlanBasicsPayload, error) {
	plan := models.PlanBasics{
		CreatedBy: null.StringFrom(principal),
		ID:        input.ModelPlanID,
	}

	plan.ModifiedBy = plan.CreatedBy
	createdPlan, err := store.PlanBasicsCreate(logger, &plan)

	payload := model.CreatePlanBasicsPayload{
		ID:         createdPlan.ID,
		UserErrors: nil,
	}
	return &payload, err
}

func FetchPlanBasicsByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
	plan, err := store.PlanBasicsGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}
