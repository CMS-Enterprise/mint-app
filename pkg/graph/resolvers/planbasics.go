package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func CreatePlanBasicsResolver(logger *zap.Logger, input *models.PlanBasics, principal *string, store *storage.Store) (*models.PlanBasics, error) {

	input.CreatedBy = principal

	input.ModifiedBy = input.CreatedBy
	retBasics, err := store.PlanBasicsCreate(logger, input)

	// payload := model.CreatePlanBasicsPayload{
	// 	ID:         createdPlan.ID,
	// 	UserErrors: nil,
	// }
	return retBasics, err
}

func UpdatePlanBasicsResolver(logger *zap.Logger, input *models.PlanBasics, principal *string, store *storage.Store) (*models.PlanBasics, error) {
	input.ModifiedBy = principal

	retBasics, err := store.PlanBasicsUpdate(logger, input)
	return retBasics, err

}
func PlanBasicsGetByModelPlanID(logger *zap.Logger, principal *string, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
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
