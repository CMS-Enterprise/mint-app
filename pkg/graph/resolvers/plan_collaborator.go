package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func CreatePlanCollaborator(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {

	input.CreatedBy = principal

	input.ModifiedBy = input.CreatedBy
	retCollaborator, err := store.PlanCollaboratorCreate(logger, input)

	return retCollaborator, err
}

func UpdatePlanCollaborator(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {
	input.ModifiedBy = principal

	retCollaborator, err := store.PlanCollaboratorUpdate(logger, input)
	return retCollaborator, err

}

func DeletePlanCollaborator(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {
	retCollaborator, err := store.PlanCollaboratorDelete(logger, input)
	return retCollaborator, err
}

func FetchCollaboratorsByModelPlanID(logger *zap.Logger, _ *string, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanCollaborator, error) {
	// TODO Do something with principal??

	collaborators, err := store.PlanCollaboratorsByModelPlanID(logger, modelPlanID)
	return collaborators, err
}
