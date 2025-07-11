package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoCommonSolutionSystemOwnerLoaders holds LoaderWrappers related to MTOCommonSolutionSystemOwner
type mtoCommonSolutionSystemOwnerLoaders struct {
	// ByID returns a single MTOCommonSolutionSystemOwner by its UUID
	ByID LoaderWrapper[uuid.UUID, *models.MTOCommonSolutionSystemOwner]
	// ByCommonSolutionKey returns a single MTOCommonSolutionSystemOwner by its common solution key
	ByCommonSolutionKey LoaderWrapper[models.MTOCommonSolutionKey, *models.MTOCommonSolutionSystemOwner]
}

// MTOCommonSolutionSystemOwner is the singleton instance of all LoaderWrappers related to MTOCommonSolutionSystemOwner
var MTOCommonSolutionSystemOwner = &mtoCommonSolutionSystemOwnerLoaders{
	ByID:                NewLoaderWrapper(batchMTOCommonSolutionSystemOwnerGetByID),
	ByCommonSolutionKey: NewLoaderWrapper(batchMTOCommonSolutionSystemOwnerGetBySolutionKey),
}

// batchMTOCommonSolutionSystemOwnerGetBySolutionKey loads System Owners by a list of Keys
func batchMTOCommonSolutionSystemOwnerGetBySolutionKey(ctx context.Context, commonSolutionKeys []models.MTOCommonSolutionKey) []*dataloader.Result[*models.MTOCommonSolutionSystemOwner] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, *models.MTOCommonSolutionSystemOwner](commonSolutionKeys, err)
	}

	data, err := storage.MTOCommonSolutionSystemOwnerGetByCommonSolutionKeyLoader(loaders.DataReader.Store, logger, commonSolutionKeys)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, *models.MTOCommonSolutionSystemOwner](commonSolutionKeys, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolutionSystemOwner) models.MTOCommonSolutionKey {
		return data.Key
	}

	// implement one to one
	return oneToOneDataLoader(commonSolutionKeys, data, getKeyFunc)
}

// batchMTOCommonSolutionSystemOwnerGetByID loads System Owners by a list of IDs
func batchMTOCommonSolutionSystemOwnerGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOCommonSolutionSystemOwner] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonSolutionSystemOwner](ids, err)
	}

	data, err := storage.MTOCommonSolutionSystemOwnerGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonSolutionSystemOwner](ids, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolutionSystemOwner) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}
