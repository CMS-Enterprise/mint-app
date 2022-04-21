package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanBasicsResolver implements resolver logic to create a plan basics object
func CreatePlanBasicsResolver(logger *zap.Logger, input *models.PlanBasics, principal *string, store *storage.Store) (*models.PlanBasics, error) {

	input.CreatedBy = principal

	input.ModifiedBy = input.CreatedBy
	input.CalcStatus()
	retBasics, err := store.PlanBasicsCreate(logger, input)

	// payload := model.CreatePlanBasicsPayload{
	// 	ID:         createdPlan.ID,
	// 	UserErrors: nil,
	// }
	return retBasics, err
}

// UpdatePlanBasicsResolver implements resolver logic to update a plan basics object
func UpdatePlanBasicsResolver(logger *zap.Logger, input *models.PlanBasics, principal *string, store *storage.Store) (*models.PlanBasics, error) {
	input.ModifiedBy = principal
	input.CalcStatus()

	retBasics, err := store.PlanBasicsUpdate(logger, input)
	return retBasics, err
}

// PlanBasicsGetByModelPlanID implements resolver logic to get plan basics by a model plan ID
func PlanBasicsGetByModelPlanID(logger *zap.Logger, principal *string, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
	plan, err := store.PlanBasicsGetByModelPlanID(logger, principal, modelPlanID)
	if err != nil {
		return nil, err
	}

	return plan, nil

}

// FetchPlanBasicsByID implements resolver logic to get plan basics by ID
func FetchPlanBasicsByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
	plan, err := store.PlanBasicsGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}
