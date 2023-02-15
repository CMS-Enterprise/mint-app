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

// OperationalNeedCollectionGetByModelPlanID returns possible and existing OperationalNeeds associated to a model plan
func OperationalNeedCollectionGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.OperationalNeed, error) {

	needs, err := store.OperationalNeedCollectionGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	return needs, nil
}

// OperationalNeedCollectionGetByModelPlanIDLOADER returns possible and existing OperationalNeeds associated to a model plan
func OperationalNeedCollectionGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.OperationalNeed, error) {
	allLoaders := loaders.Loaders(ctx)
	opNeedLoader := allLoaders.OperationalNeedLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := opNeedLoader.Loader.Load(ctx, key)

	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result.([]*models.OperationalNeed), nil

}

// OperationalNeedInsertOrUpdateCustom adds or updates a Custom Operational Need
func OperationalNeedInsertOrUpdateCustom(logger *zap.Logger, modelPlanID uuid.UUID, customNeedType string, needed bool, principal authentication.Principal, store *storage.Store) (*models.OperationalNeed, error) {

	existing, err := store.OperationalNeedGetByModelPlanIDAndOtherType(logger, modelPlanID, customNeedType)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		existing = models.NewOperationalNeed(principal.Account().ID, modelPlanID)
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

// OperationalNeedCustomUpdateByID updates an Operational Need by it's ID. Note, we don't allow updating a need type, except customNeedTypes
func OperationalNeedCustomUpdateByID(logger *zap.Logger, operationNeedID uuid.UUID, customNeedType *string, needed bool, principal authentication.Principal, store *storage.Store) (*models.OperationalNeed, error) {

	existing, err := store.OperationalNeedGetByID(logger, operationNeedID)
	if err != nil {
		return nil, err
	}

	changes := map[string]interface{}{
		"needed":    needed,
		"nameOther": customNeedType,
	}

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	return store.OperationalNeedUpdateByID(logger, existing)

}

// OperationalNeedGetByID returns an operational Need by it's ID
func OperationalNeedGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.OperationalNeed, error) {
	return store.OperationalNeedGetByID(logger, id)
}
