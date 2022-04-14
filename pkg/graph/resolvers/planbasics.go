package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func CreatePlanBasicsResolver(logger *zap.Logger, input model.PlanBasicsInput, principal *string, store *storage.Store) (*models.PlanBasics, error) {
	plan := models.PlanBasics{
		CreatedBy:   principal,
		ModelPlanID: *input.ModelPlanID,
	}

	plan.ModifiedBy = plan.CreatedBy
	createdPlan, err := store.PlanBasicsCreate(logger, &plan)

	// payload := model.CreatePlanBasicsPayload{
	// 	ID:         createdPlan.ID,
	// 	UserErrors: nil,
	// }
	return createdPlan, err
}

func UpdatePlanBasicsResolver(logger *zap.Logger, input *models.PlanBasics, principal *string, store *storage.Store) (*models.PlanBasics, error) {

	retBasics, err := store.PlanBasicsUpdate(logger, input)
	return retBasics, err

}
func FetchPlanBasicsByModelPlanID(logger *zap.Logger, principal *string, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
	plan, err := store.PlanBasicsGetByModelPlanID(logger, principal, modelPlanID)
	if err != nil {
		return nil, err
	}

	return plan, nil

}

func FetchPlanBasicsByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
	plan, err := store.PlanBasicsGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}
