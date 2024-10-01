package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	dataloaderOld "github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

type operationalSolutionsLoaders struct {
	ByOperationalNeedID            *dataloader.Loader[uuid.UUID, *models.OperationalSolution]
	AndPossibleByOperationalNeedID *dataloader.Loader[storage.SolutionAndPossibleKey, []*models.OperationalSolution]
	//TODO: (loaders) consider renaming this
}

func (l *operationalSolutionsLoaders) init() {
	l.ByOperationalNeedID = OperationalSolutions.ByOperationalNeedID.NewBatchedLoader()
	l.AndPossibleByOperationalNeedID = OperationalSolutions.AndPossibleByOperationalNeedID.NewBatchedLoader()
}
func newOperationalSolutionsLoaders() operationalSolutionsLoaders {
	loader := operationalSolutionsLoaders{}
	loader.init()
	return loader
}

type operationalSolutionsLoaderConfig struct {
	// ByOperationalNeedID Returns an operational solution by an operational need id
	ByOperationalNeedID LoaderConfig[uuid.UUID, *models.OperationalSolution]
	// AndPossibleByOperationalNeedID Returns an array of operational solutions, and possible operational solutions by an operational need id
	AndPossibleByOperationalNeedID LoaderConfig[storage.SolutionAndPossibleKey, []*models.OperationalSolution]
}

// OperationalSolutions is the loader config for all operational solution fetching
var OperationalSolutions = operationalSolutionsLoaderConfig{
	ByOperationalNeedID: LoaderConfig[uuid.UUID, *models.OperationalSolution]{

		// Load: ,
		// batchFunction: ,
		//TODO: (loaders) implement this
	},
	AndPossibleByOperationalNeedID: LoaderConfig[storage.SolutionAndPossibleKey, []*models.OperationalSolution]{
		Load:          OperationalSolutionAndPossibleCollectionGetByOperationalNeedID,
		batchFunction: batchOperationalSolutionAndPossibleCollectionGetByOperationalNeedID,
	},
}

// GetOperationalSolutionAndPossibleCollectionByOperationalNeedID uses a data loader to return operational solutions by operational need id
func (loaders *DataLoaders) GetOperationalSolutionAndPossibleCollectionByOperationalNeedID(ctx context.Context, keys dataloaderOld.Keys) []*dataloaderOld.Result {
	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Operational Solutions", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Operational Solutions", zap.Error(*err))
	}

	dr := loaders.DataReader

	sols, loadErr := dr.Store.OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(logger, marshaledParams)
	if loadErr != nil {
		return []*dataloaderOld.Result{{Data: nil, Error: loadErr}}

	}
	solsByID := map[string][]*models.OperationalSolution{}
	for _, sol := range sols {
		slice, ok := solsByID[string(sol.OperationalNeedID.String())]
		if ok {
			slice = append(slice, sol) //Add to existing slice
			solsByID[string(sol.OperationalNeedID.String())] = slice
			continue
		}
		solsByID[string(sol.OperationalNeedID.String())] = []*models.OperationalSolution{sol}
	}

	output := make([]*dataloaderOld.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {

			resKey := fmt.Sprint(ck.Args["operational_need_id"])
			sols := solsByID[resKey] //Any Solutions not found will return a zero state result eg empty array

			output[index] = &dataloaderOld.Result{Data: sols, Error: nil}

		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloaderOld.Result{Data: nil, Error: err}
		}

	}
	return output

}

func OperationalSolutionAndPossibleCollectionGetByOperationalNeedID(ctx context.Context, key storage.SolutionAndPossibleKey) ([]*models.OperationalSolution, error) {
	allLoaders := Loaders(ctx)
	loader := allLoaders.operationalSolutions.AndPossibleByOperationalNeedID
	return loader.Load(ctx, key)()
}

func batchOperationalSolutionAndPossibleCollectionGetByOperationalNeedID(ctx context.Context, keys []storage.SolutionAndPossibleKey) []*dataloader.Result[[]*models.OperationalSolution] {
	logger := appcontext.ZLogger(ctx)
	output := make([]*dataloader.Result[[]*models.OperationalSolution], len(keys))
	loaders := Loaders(ctx)

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
		//TODO (loaders) we aren't verifying the not needed when we return the result.... We should be including needed / not needed programatically. Currently not doing it

		sols := solsByID[key.OperationalNeedID] //Any Solutions not found will return a zero state result eg empty array

		output[index] = &dataloader.Result[[]*models.OperationalSolution]{Data: sols, Error: nil}

	}
	return output

}
