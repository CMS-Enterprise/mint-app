package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ExistingModelCollectionGet returns all existing models
func ExistingModelCollectionGet(logger *zap.Logger, store *storage.Store) ([]*models.ExistingModel, error) {
	existingModels, err := store.ExistingModelCollectionGet(logger)
	if err != nil {
		return nil, err
	}
	return existingModels, err

}
