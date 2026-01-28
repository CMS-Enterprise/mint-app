package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
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
	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
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

// OperationalNeedGetByID returns an operational Need by it's ID
func OperationalNeedGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.OperationalNeed, error) {
	return store.OperationalNeedGetByID(logger, id)
}
