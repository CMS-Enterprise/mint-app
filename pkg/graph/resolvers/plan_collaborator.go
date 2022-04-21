package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanCollaborator implements resolver logic to create a plan collaborator
func CreatePlanCollaborator(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {

	input.CreatedBy = principal

	input.ModifiedBy = input.CreatedBy
	retCollaborator, err := store.PlanCollaboratorCreate(logger, input)

	return retCollaborator, err
}

// UpdatePlanCollaborator implements resolver logic to update a plan collaborator
func UpdatePlanCollaborator(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {
	input.ModifiedBy = principal

	retCollaborator, err := store.PlanCollaboratorUpdate(logger, input)
	return retCollaborator, err

}

// DeletePlanCollaborator implements resolver logic to delete a plan collaborator
func DeletePlanCollaborator(logger *zap.Logger, input *models.PlanCollaborator, principal *string, store *storage.Store) (*models.PlanCollaborator, error) {
	retCollaborator, err := store.PlanCollaboratorDelete(logger, input)
	return retCollaborator, err
}

// FetchCollaboratorsByModelPlanID implements resolver logic to fetch a list of plan collaborators by a model plan ID
func FetchCollaboratorsByModelPlanID(logger *zap.Logger, _ *string, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanCollaborator, error) {
	// TODO Do something with principal??

	collaborators, err := store.PlanCollaboratorsByModelPlanID(logger, modelPlanID)
	return collaborators, err
}
