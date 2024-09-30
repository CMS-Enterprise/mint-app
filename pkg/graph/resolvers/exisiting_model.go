package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// ExistingModelCollectionGet returns all existing models
func ExistingModelCollectionGet(logger *zap.Logger, store *storage.Store) ([]*models.ExistingModel, error) {
	existingModels, err := store.ExistingModelCollectionGet(logger)
	if err != nil {
		return nil, err
	}
	return existingModels, err

}

// ExistingModelGetByIDLOADER implements resolver logic to get Existing Model by a model plan ID using a data loader
func ExistingModelGetByIDLOADER(ctx context.Context, id int) (*models.ExistingModel, error) {
	allLoaders := loaders.Loaders(ctx)
	eMLoader := allLoaders.ExistingModelLoader
	key := loaders.NewKeyArgs()
	key.Args["id"] = id

	thunk := eMLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.ExistingModel), nil
}
