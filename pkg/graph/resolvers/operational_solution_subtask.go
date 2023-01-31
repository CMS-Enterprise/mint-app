package resolvers

import (
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"

	"github.com/cmsgov/mint-app/pkg/accesscontrol"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// OperationalSolutionSubtasksCreate implements resolver logic to create an operational solution subtask in the database
func OperationalSolutionSubtasksCreate(
	logger *zap.Logger,
	store *storage.Store,
	inputs []*model.CreateOperationalSolutionSubtaskInput,
	solutionID uuid.UUID,
	principal authentication.Principal,
) ([]*models.OperationalSolutionSubtask, error) {
	var subtasks []*models.OperationalSolutionSubtask

	for _, input := range inputs {
		subtask := models.NewOperationalSolutionSubtask(
			principal.Account().ID,
			uuid.New(),
			solutionID,
			input.Name,
			input.Status,
		)

		err := BaseStructPreCreate(logger, subtask, principal, store, true)
		if err != nil {
			return nil, err
		}

		subtasks = append(subtasks, subtask)
	}

	return store.OperationalSolutionSubtasksCreate(logger, subtasks)
}

// OperationalSolutionSubtaskGetByID implements the resolver logic to get an operational solution subtask by ID
func OperationalSolutionSubtaskGetByID(
	logger *zap.Logger,
	store *storage.Store,
	subtaskID uuid.UUID,
) (*models.OperationalSolutionSubtask, error) {
	subtask, err := store.OperationalSolutionSubtaskGetByID(logger, subtaskID)

	if err != nil {
		return nil, err
	}

	return subtask, err
}

// OperationalSolutionSubtasksGetBySolutionID implements the resolver logic to
// get operational solution subtasks by solution ID
func OperationalSolutionSubtasksGetBySolutionID(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	solutionID uuid.UUID,
) ([]*models.OperationalSolutionSubtask, error) {

	isCollaborator, err := accesscontrol.IsCollaboratorSolutionID(logger, principal, store, solutionID)
	if err != nil {
		return nil, err
	}

	if !isCollaborator {
		return nil, errors.New("user is not a collaborator for the provided solution id")
	}

	subtasks, err := store.OperationalSolutionSubtasksGetBySolutionID(logger, solutionID)

	if err != nil {
		return nil, err
	}

	return subtasks, err
}

// OperationalSolutionSubtasksUpdateByID implements the resolver logic to update
// a collection of operational solution subtasks by ID
func OperationalSolutionSubtasksUpdateByID(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	subtasksChanges []*model.UpdateOperationalSolutionSubtaskInput,
) ([]*models.OperationalSolutionSubtask, error) {
	var subtaskUpdates []*models.OperationalSolutionSubtask

	for _, subtaskChanges := range subtasksChanges {
		// TODO: Create a transaction to fetch a collection of operational solution subtasks from a collection of IDs
		existing, err := store.OperationalSolutionSubtaskGetByID(logger, subtaskChanges.ID)
		if err != nil {
			return nil, err
		}

		err = BaseStructPreUpdate(
			logger,
			existing,
			subtaskChanges.Changes,
			principal,
			store,
			true,
			true,
		)
		if err != nil {
			return nil, err
		}

		subtaskUpdates = append(subtaskUpdates, existing)
	}

	return store.OperationalSolutionSubtasksUpdate(logger, subtaskUpdates)
}

// OperationalSolutionSubtaskDelete implements resolver logic to delete an operational solution subtask
func OperationalSolutionSubtaskDelete(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	id uuid.UUID,
) (int, error) {
	existingSubtask, err := store.OperationalSolutionSubtaskGetByID(logger, id)
	if err != nil {
		return 0, err
	}

	err = BaseStructPreDelete(logger, existingSubtask, principal, store, true)
	if err != nil {
		return 0, err
	}

	sqlResult, err := store.OperationalSolutionSubtaskDelete(logger, id)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := sqlResult.RowsAffected()
	return int(rowsAffected), err
}
