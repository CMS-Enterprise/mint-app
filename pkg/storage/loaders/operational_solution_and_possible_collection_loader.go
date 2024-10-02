package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

func operationalSolutionAndPossibleCollectionGetByOperationalNeedID(ctx context.Context, key storage.SolutionAndPossibleKey) ([]*models.OperationalSolution, error) {
	allLoaders, ok := Loaders(ctx)
	if !ok {
		return nil, ErrNoLoaderOnContext
	}
	loader := allLoaders.operationalSolutions.AndPossibleByOperationalNeedIDWithIncludeNotNeeded
	return loader.Load(ctx, key)()
}

func batchOperationalSolutionAndPossibleCollectionGetByOperationalNeedID(ctx context.Context, keys []storage.SolutionAndPossibleKey) []*dataloader.Result[[]*models.OperationalSolution] {
	logger := appcontext.ZLogger(ctx)
	output := make([]*dataloader.Result[[]*models.OperationalSolution], len(keys))
	loaders, ok := Loaders(ctx)
	if !ok {
		for index := range keys {
			output[index] = &dataloader.Result[[]*models.OperationalSolution]{Data: nil, Error: ErrNoLoaderOnContext}
		}
		return output
	}

	sols, loadErr := storage.OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(loaders.DataReader.Store, logger, keys)

	if loadErr != nil {
		for index := range keys {
			output[index] = &dataloader.Result[[]*models.OperationalSolution]{Data: nil, Error: loadErr}
		}
		return output

	}
	solsByID := map[uuid.UUID][]*models.OperationalSolution{}
	for _, sol := range sols {
		slice, ok := solsByID[sol.OperationalNeedID]
		if ok {
			slice = append(slice, sol) //Add to existing slice
			solsByID[sol.OperationalNeedID] = slice
			continue
		}
		solsByID[sol.OperationalNeedID] = []*models.OperationalSolution{sol}
	}

	for index, key := range keys {
		//Note we aren't verifying the not needed when we return the result.... We should be including needed / not needed programmatically.
		//  This is an edge case when a need is queried twice, once with needed once without. In practice, this doesn't happen. As this is getting refactored, we will leave it as is.

		sols := solsByID[key.OperationalNeedID] //Any Solutions not found will return a zero state result eg empty array

		output[index] = &dataloader.Result[[]*models.OperationalSolution]{Data: sols, Error: nil}

	}
	return output

}
