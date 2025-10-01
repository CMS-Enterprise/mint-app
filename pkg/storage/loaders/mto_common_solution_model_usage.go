package loaders

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoCommonSolutionModelUsageLoaders is a struct that holds LoaderWrappers related to MTO Solutions
type mtoCommonSolutionModelUsageLoaders struct {

	// ByCommonSolutionKey returns a list of mto Common Solution model usage records by their keys. It does not currently have contextual data
	ByCommonSolutionKey LoaderWrapper[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionModelUsage]
}

// MTOCommonSolutionModelUsage is the singleton instance of all LoaderWrappers related to MTO Common Solutions
var MTOCommonSolutionModelUsage = NewLoaderWrapper(batchMTOCommonSolutionModelUsageGetAll)

// batchMTOCommonSolutionModelUsageGetAll returns a list of common Solutions as a dataloader.Result for a list of commonSolutionKeys (they are linked)
func batchMTOCommonSolutionModelUsageGetAll(ctx context.Context, commonSolutionKeys []models.MTOCommonSolutionKey) []*dataloader.Result[[]*models.MTOCommonSolutionModelUsage] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionModelUsage](commonSolutionKeys, err)
	}

	data, err := storage.GetMTOCommonSolutionModelUsageByCommonSolutionKey(loaders.DataReader.Store, logger, commonSolutionKeys)
	if err != nil {
		return errorPerEachKey[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionModelUsage](commonSolutionKeys, err)
	}

	getKeyFunc := func(data *models.MTOCommonSolutionModelUsage) models.MTOCommonSolutionKey {
		return data.Key
	}

	// implement one to many
	return oneToManyDataLoader(commonSolutionKeys, data, getKeyFunc)

}
