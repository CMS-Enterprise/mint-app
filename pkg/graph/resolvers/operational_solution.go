package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// OperationaSolutionsAndPossibleGetByOPNeedID returns operational Solutions and possible Operational Solutions based on a specific operational Need
func OperationaSolutionsAndPossibleGetByOPNeedID(logger *zap.Logger, operationalNeedID uuid.UUID, includeNotNeeded bool, store *storage.Store) ([]*models.OperationalSolution, error) {

	sols, err := store.OperationalSolutionAndPossibleCollectionGetByOperationalNeedID(logger, operationalNeedID, includeNotNeeded)

	return sols, err
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

// OperationalSolutionInsertOrUpdateCustom either inserts or updates an operational Solution depending on if it exists or notalready
func OperationalSolutionInsertOrUpdateCustom(logger *zap.Logger, operationNeedID uuid.UUID, customSolutionType string, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.OperationalSolution, error) {

	existing, err := store.OperationalSolutionGetByOperationNeedIDAndOtherType(logger, operationNeedID, customSolutionType)
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

	return store.OperationalSolutionInsertOrUpdateOther(logger, existing, customSolutionType)

}

// OperationalSolutionCustomUpdateByID updates an operational Solution by it's ID
func OperationalSolutionCustomUpdateByID(logger *zap.Logger, id uuid.UUID, customSolutionType *string, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.OperationalSolution, error) {

	existing, err := store.OperationalSolutionGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, false) ///TODO!!! update so we can check if the user has access or not!
	if err != nil {
		return nil, err
	}
	existing.NameOther = customSolutionType //update the custom solutiopn type

	return store.OperationalSolutionUpdateByID(logger, existing)

}

// OperationalSolutionGetByID returns an operational Solution by it's ID
func OperationalSolutionGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.OperationalSolution, error) {
	return store.OperationalSolutionGetByID(logger, id)
}
