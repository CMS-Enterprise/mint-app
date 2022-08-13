package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanCollaborator implements resolver logic to create a plan collaborator
func CreatePlanCollaborator(logger *zap.Logger, input *model.PlanCollaboratorCreateInput, principal authentication.Principal, store *storage.Store) (*models.PlanCollaborator, error) {
	collaborator := &models.PlanCollaborator{
		ModelPlanRelation: models.ModelPlanRelation{
			ModelPlanID: input.ModelPlanID,
		},
		FullName:  input.FullName,
		TeamRole:  input.TeamRole,
		EUAUserID: input.EuaUserID,
		BaseStruct: models.BaseStruct{
			CreatedBy: principal.ID(),
		},
	}

	retCollaborator, err := store.PlanCollaboratorCreate(logger, collaborator)
	return retCollaborator, err
}

// UpdatePlanCollaborator implements resolver logic to update a plan collaborator
func UpdatePlanCollaborator(logger *zap.Logger, id uuid.UUID, newRole models.TeamRole, principal authentication.Principal, store *storage.Store) (*models.PlanCollaborator, error) {
	// Get existing collaborator
	existingCollaborator, err := store.PlanCollaboratorFetchByID(id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreUpdate(logger, existingCollaborator, nil, principal, store, false)
	if err != nil {
		return nil, err
	}
	// modified := principal.ID()

	// isCollaborator, err := IsCollaboratorModelPlanID(logger, principal, store, existingCollaborator.ModelPlanID)
	// if err != nil {
	// 	return nil, err
	// }
	// if !isCollaborator {
	// 	return nil, fmt.Errorf("user is not a collaborator") //TODO better error here please.
	// }

	// existingCollaborator.ModifiedBy = &modified
	existingCollaborator.TeamRole = newRole

	return store.PlanCollaboratorUpdate(logger, existingCollaborator)
}

// DeletePlanCollaborator implements resolver logic to delete a plan collaborator
func DeletePlanCollaborator(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.PlanCollaborator, error) {
	//TODO CHECK IF COLLABORATOR
	retCollaborator, err := store.PlanCollaboratorDelete(logger, id)
	return retCollaborator, err
}

// FetchCollaboratorsByModelPlanID implements resolver logic to fetch a list of plan collaborators by a model plan ID
func FetchCollaboratorsByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanCollaborator, error) {
	// TODO Do something with principal??

	collaborators, err := store.PlanCollaboratorsByModelPlanID(logger, modelPlanID)
	return collaborators, err
}

// FetchCollaboratorByID implements resolver logic to fetch a plan collaborator by ID
func FetchCollaboratorByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanCollaborator, error) {
	collaborator, err := store.PlanCollaboratorFetchByID(id)
	return collaborator, err
}
