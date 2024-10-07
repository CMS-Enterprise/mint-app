package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

func batchOperationalSolutionAndPossibleCollectionGetByOperationalNeedID(ctx context.Context, keys []storage.SolutionAndPossibleKey) []*dataloader.Result[[]*models.OperationalSolution] {
	logger := appcontext.ZLogger(ctx)

	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[storage.SolutionAndPossibleKey, []*models.OperationalSolution](keys, err)

	}

	sols, loadErr := storage.OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(loaders.DataReader.Store, logger, keys)
	if loadErr != nil {
		return errorPerEachKey[storage.SolutionAndPossibleKey, []*models.OperationalSolution](keys, loadErr)
	}
	// getKeyFunc := func(data *models.OperationalSolution) uuid.UUID {
	// 	return data.OperationalNeedID
	// }
	// We recreate the key, first, check if the data is needed (has a set value, and has an id)
	// Then we map the operational need id
	getKeyFunc := func(data *models.OperationalSolution) storage.SolutionAndPossibleKey {
		needed := false

		if data.Needed != nil && data.ID != uuid.Nil {
			needed = *data.Needed
		}

		include := false
		if needed {
			include = true
		}
		return storage.SolutionAndPossibleKey{
			OperationalNeedID: data.OperationalNeedID,
			IncludeNotNeeded:  include,
		}
	}
	return oneToManyDataLoaderFunc(keys, sols, getKeyFunc)

}
