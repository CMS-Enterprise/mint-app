package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// OperationalSolutionCollectionGetByOperationalNeedID returns Operational Solutions correspondind to an Operational Need
func OperationalSolutionCollectionGetByOperationalNeedID(logger *zap.Logger, operationalNeedID uuid.UUID, store *storage.Store) ([]*models.OperationalSolution, error) {
	// result, err := store.OperationalSolutionGetByModelPlanID(logger,modelPlanID);
	return store.OperationalSolutionCollectionGetByOperationalNeedID(logger, operationalNeedID)
}

// OperationalSolutionInsertOrUpdate either inserts or updates an operational Solution depending on if it exists or notalready
func OperationalSolutionInsertOrUpdate(logger *zap.Logger, operationNeedID uuid.UUID, solutionType string, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.OperationalSolution, error) {

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
