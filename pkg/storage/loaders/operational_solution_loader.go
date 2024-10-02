package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	dataloaderOld "github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

type operationalSolutionsLoaders struct {
	ByOperationalNeedID                                *dataloader.Loader[uuid.UUID, *models.OperationalSolution]
	AndPossibleByOperationalNeedIDWithIncludeNotNeeded *dataloader.Loader[storage.SolutionAndPossibleKey, []*models.OperationalSolution]
	//TODO: (loaders) consider renaming this
}

func (l *operationalSolutionsLoaders) init() {
	l.ByOperationalNeedID = OperationalSolutions.ByOperationalNeedID.NewBatchedLoader()
	l.AndPossibleByOperationalNeedIDWithIncludeNotNeeded = OperationalSolutions.AndPossibleByOperationalNeedID.NewBatchedLoader()
}
func newOperationalSolutionsLoaders() operationalSolutionsLoaders {
	loader := operationalSolutionsLoaders{}
	loader.init()
	return loader
}

type operationalSolutionsLoaderConfig struct {
	// ByOperationalNeedID Returns an operational solution by an operational need id
	ByOperationalNeedID LoaderConfig[uuid.UUID, *models.OperationalSolution]
	// AndPossibleByOperationalNeedID Returns an array of operational solutions, and possible operational solutions by an operational need id. It also will conditionally return needed / not needed
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
		Load:          operationalSolutionAndPossibleCollectionGetByOperationalNeedID,
		batchFunction: batchOperationalSolutionAndPossibleCollectionGetByOperationalNeedID,
	},
}

// OperationalSolutionGetByID uses a data loader to return an operational solution by ID
func (loaders *DataLoaders) OperationalSolutionGetByID(
	ctx context.Context,
	keys dataloaderOld.Keys,
) []*dataloaderOld.Result {
	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Operational Solution", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Operational Solution", zap.Error(*err))
	}

	dr := loaders.DataReader

	opSols, loadErr := dr.Store.OperationalSolutionGetByIDLOADER(logger, marshaledParams)
	if loadErr != nil {
		return []*dataloaderOld.Result{{Data: nil, Error: loadErr}}
	}

	opSolsByID := lo.Associate(opSols, func(gc *models.OperationalSolution) (string, *models.OperationalSolution) {
		return gc.ID.String(), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloaderOld.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			opSol, ok := opSolsByID[resKey]
			if ok {
				output[index] = &dataloaderOld.Result{Data: opSol, Error: nil}
			} else {
				err := fmt.Errorf("operational solution not found for id %s", resKey)
				output[index] = &dataloaderOld.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloaderOld.Result{Data: nil, Error: err}
		}
	}

	return output
}
