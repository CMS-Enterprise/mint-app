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

	// We use just operational need ID for the intermediate map
	getKeyFunc := func(data *models.OperationalSolution) uuid.UUID {
		return data.OperationalNeedID
	}
	getResFunc := func(key storage.SolutionAndPossibleKey, resMap map[uuid.UUID][]*models.OperationalSolution) ([]*models.OperationalSolution, bool) {
		res, ok := resMap[key.OperationalNeedID]
		// NOTE: we don't filter out the not needed for this loader, as it isn't possible to request it from the resolver
		// if !key.IncludeNotNeeded {
		// 	lo.Filter(res, func(sol *models.OperationalSolution, _ int) bool {
		// 		if sol.Needed == nil{
		// 			return false
		// 		}
		// 		return *sol.Needed
		// 	})
		// }
		return res, ok
	}
	return oneToManyWithCustomKeyDataLoader(keys, sols, getKeyFunc, getResFunc)

}
