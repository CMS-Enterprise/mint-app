package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// OperationalSolutionCollectionGetByOperationalNeedID returns Operational Solutions correspondind to an Operational Need
func OperationalSolutionCollectionGetByOperationalNeedID(logger *zap.Logger, operationalNeedID uuid.UUID, store *storage.Store) ([]*models.OperationalSolution, error) {
	// result, err := store.OperationalSolutionGetByModelPlanID(logger,modelPlanID);
	return store.OperationalSolutionCollectionGetByOperationalNeedID(logger, operationalNeedID)
}

// OperationaSolutionsGetByOPNeed returns operational Solutions and possible Operational Solutions based on a specific operational Need
func OperationaSolutionsGetByOPNeed(logger *zap.Logger, need *models.OperationalNeed, store *storage.Store) (*model.OperationalSolutions, error) {
	opSols := model.OperationalSolutions{}
	sols, err := store.OperationalSolutionCollectionGetByOperationalNeedID(logger, need.ID)
	if err != nil {
		return nil, err
	}
	opSols.Solutions = sols

	posSols, err := store.PossibleOperationalSolutionCollectionGetByNeedType(logger, need.NeedTypeShortName) //This is everyone, we don't exclude selected ones
	if err != nil {
		return nil, err
	}
	opSols.PossibleSolutions = posSols
	// result, err := store.OperationalNeedGetByModelPlanID(logger,modelPlanID);
	return &opSols, nil
}

// OperationalSolutionInsertOrUpdate either inserts or updates an operational Solution depending on if it exists or notalready
func OperationalSolutionInsertOrUpdate(logger *zap.Logger, operationNeedID uuid.UUID, solutionType models.OperationalSolutionKey, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.OperationalSolution, error) {

	existing, err := store.OperationalSolutionGetByOperationNeedIDAndType(logger, operationNeedID, solutionType)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		existing = models.NewOperationalSolution(principal.ID(), operationNeedID)
	}

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, false) ///TODO!!! update so we can check if the user has access or not!
	if err != nil {
		return nil, err
	}

	return store.OperationalSolutionInsertOrUpdate(logger, existing, solutionType)

}
