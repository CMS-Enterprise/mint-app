package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

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

// OperationalSolutionSubtaskGetBySolutionIDLOADER implements resolver logic to get Operational Solution Subtask by a model plan ID using a data loader
func OperationalSolutionSubtaskGetBySolutionIDLOADER(ctx context.Context, solutionID uuid.UUID) ([]*models.OperationalSolutionSubtask, error) {
	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
	OpSolSLoader := allLoaders.OperationSolutionSubtaskLoader
	key := loaders.NewKeyArgs()
	key.Args["solution_id"] = solutionID

	thunk := OpSolSLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.OperationalSolutionSubtask), nil
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

	sqlResult, err := store.OperationalSolutionSubtaskDelete(logger, id, principal.Account().ID)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := sqlResult.RowsAffected()
	return int(rowsAffected), err
}
