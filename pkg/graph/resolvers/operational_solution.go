package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

// OperationalSolutionCreate calls a DB method to create an operational solution
func OperationalSolutionCreate(logger *zap.Logger, operationNeedID uuid.UUID, solutionType *models.OperationalSolutionKey, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.OperationalSolution, error) {
	opSol := models.NewOperationalSolution(principal.Account().ID, operationNeedID)

	err := BaseStructPreUpdate(logger, opSol, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	return store.OperationalSolutionInsert(logger, opSol, solutionType)

}

// OperationalSolutionUpdate updates an operational Solution by it's ID
func OperationalSolutionUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.OperationalSolution, error) {

	existing, err := store.OperationalSolutionGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}
	return store.OperationalSolutionUpdateByID(logger, existing)

}

// OperationaSolutionsAndPossibleGetByOPNeedIDLOADER returns operational Solutions and possible Operational Solutions based on a specific operational Need ID using a Data Loader
func OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(ctx context.Context, operationalNeedID uuid.UUID, includeNotNeeded bool) ([]*models.OperationalSolution, error) {
	allLoaders := loaders.Loaders(ctx)
	opSolutionLoader := allLoaders.OperationSolutionLoader

	key := loaders.NewKeyArgs()

	key.Args["include_not_needed"] = includeNotNeeded
	key.Args["operational_need_id"] = operationalNeedID

	thunk := opSolutionLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.OperationalSolution), nil
}

// OperationalSolutionGetByID returns an operational Solution by it's ID
func OperationalSolutionGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.OperationalSolution, error) {
	return store.OperationalSolutionGetByID(logger, id)
}
