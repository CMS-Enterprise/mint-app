package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func CreatePlanCollaboratorResolver(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {

	input.CreatedBy = principal

	input.ModifiedBy = input.CreatedBy
	retCollaborator, err := store.PlanCollaboratorCreate(logger, input)

	return retCollaborator, err
}

func UpdatePlanCollaboratorResolver(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {
	input.ModifiedBy = principal

	retCollaborator, err := store.PlanCollaboratorUpdate(logger, input)
	return retCollaborator, err

}

func DeletePlanCollaboratorResolver(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {
	retCollaborator, err := store.PlanCollaboratorDelete(logger, input)
	return retCollaborator, err
}

func FetchCollaboratorsByModelPlanID(logger *zap.Logger, _ *string, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanCollaborator, error) {
	// TODO Do something with principal??

	collaborators, err := store.PlanCollaboratorsByModelPlanID(logger, modelPlanID)
	return collaborators, err
}

// func FetchPlanBasicsByModelPlanID(logger *zap.Logger, principal *string, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
// 	plan, err := store.PlanBasicsGetByModelPlanID(logger, principal, modelPlanID)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return plan, nil

// }

// func FetchPlanBasicsByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanBasics, error) {
// 	plan, err := store.PlanBasicsGetByID(logger, id)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return plan, nil
// }
