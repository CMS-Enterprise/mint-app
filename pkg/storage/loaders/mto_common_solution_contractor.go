package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoCommonSolutionContractorLoaders holds LoaderWrappers related to MTOCommonSolutionContractor
type mtoCommonSolutionContractorLoaders struct {
	// ByID returns a single MTOCommonSolutionContractor by its UUID
	ByID LoaderWrapper[uuid.UUID, *models.MTOCommonSolutionContractor]
	// ByID returns a single MTOCommonSolutionContractor by its UUID
	ByCommonSolutionKey LoaderWrapper[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionContractor]
}

// MTOCommonSolutionContractor is the singleton instance of all LoaderWrappers related to MTOCommonSolutionContractor
var MTOCommonSolutionContractor = &mtoCommonSolutionContractorLoaders{
	ByID:                NewLoaderWrapper(batchMTOCommonSolutionContractorGetByID),
	ByCommonSolutionKey: NewLoaderWrapper(batchMTOCommonSolutionContractorGetBySolutionKey),
}

// batchMTOCommonSolutionContractorGetBySolutionKey loads Contractors by a list of Keys
func batchMTOCommonSolutionContractorGetBySolutionKey(ctx context.Context, commonSolutionKeys []models.MTOCommonSolutionKey) []*dataloader.Result[[]*models.MTOCommonSolutionContractor] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionContractor](commonSolutionKeys, err)
	}

	data, err := storage.MTOCommonSolutionContractorGetByCommonSolutionKeyLoader(loaders.DataReader.Store, logger, commonSolutionKeys)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionContractor](commonSolutionKeys, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolutionContractor) models.MTOCommonSolutionKey {
		return data.Key
	}

	// implement one to many
	return oneToManyDataLoader(commonSolutionKeys, data, getKeyFunc)
}

// batchMTOCommonSolutionContractorGetByID loads contractors by a list of IDs
func batchMTOCommonSolutionContractorGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.MTOCommonSolutionContractor] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonSolutionContractor](ids, err)
	}

	data, err := storage.MTOCommonSolutionContractorGetByIDLoader(loaders.DataReader.Store, logger, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOCommonSolutionContractor](ids, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolutionContractor) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}
