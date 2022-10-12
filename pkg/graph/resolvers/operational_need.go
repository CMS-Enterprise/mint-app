package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// OperationalNeedCollectionGetByModelPlanID returns possible and existing OperationalNeeds associated to a model plan
func OperationalNeedCollectionGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.OperationalNeed, error) {
	// result, err := store.OperationalNeedGetByModelPlanID(logger,modelPlanID);
	return store.OperationalNeedAndPossibleCollectionGetByModelPlanID(logger, modelPlanID)
}

// OperationalNeedsGetByModelPlanID returns possible and existing OperationalNeeds associated to a model plan
func OperationalNeedsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) (*model.OperationalNeeds, error) {
	opNeeds := model.OperationalNeeds{}
	needs, err := store.OperationalNeedCollectionGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}
	opNeeds.Needs = needs

	posNeeds, err := store.PossibleOperationalNeedCollectionGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}
	opNeeds.PossibleNeeds = posNeeds
	// result, err := store.OperationalNeedGetByModelPlanID(logger,modelPlanID);
	return &opNeeds, nil
}

// OperationalNeedInsertOrUpdate either inserts or updates an operational need depending on if it exists or notalready
func OperationalNeedInsertOrUpdate(logger *zap.Logger, modelPlanID uuid.UUID, needType models.OperationalNeedKey, needed bool, principal authentication.Principal, store *storage.Store) (*models.OperationalNeed, error) {

	existing, err := store.OperationalNeedGetByModelPlanIDAndType(logger, modelPlanID, needType)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		existing = models.NewOperationalNeed(principal.ID(), modelPlanID)
	}
	changes := map[string]interface{}{
		"needed": needed,
	}

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	return store.OperationalNeedInsertOrUpdate(logger, existing, needType)

}

// OperationalNeedInsertOrUpdateCustom adds or updates a Custom Operational Need
func OperationalNeedInsertOrUpdateCustom(logger *zap.Logger, modelPlanID uuid.UUID, customNeedType string, needed bool, principal authentication.Principal, store *storage.Store) (*models.OperationalNeed, error) {

	existing, err := store.OperationalNeedGetByModelPlanIDAndOtherType(logger, modelPlanID, customNeedType)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		existing = models.NewOperationalNeed(principal.ID(), modelPlanID)
	}
	changes := map[string]interface{}{
		"needed": needed,
	}

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	return store.OperationalNeedInsertOrUpdateOther(logger, existing, customNeedType)

}
