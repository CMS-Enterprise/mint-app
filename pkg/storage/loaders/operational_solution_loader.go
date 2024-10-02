package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

type operationalSolutionsLoaders struct {
	ByID                                               *dataloader.Loader[uuid.UUID, *models.OperationalSolution]
	AndPossibleByOperationalNeedIDWithIncludeNotNeeded *dataloader.Loader[storage.SolutionAndPossibleKey, []*models.OperationalSolution]
	//TODO: (loaders) consider renaming this
}

func (l *operationalSolutionsLoaders) init() {
	l.ByID = OperationalSolutions.ByID.NewBatchedLoader()
	l.AndPossibleByOperationalNeedIDWithIncludeNotNeeded = OperationalSolutions.AndPossibleByOperationalNeedID.NewBatchedLoader()
}
func newOperationalSolutionsLoaders() operationalSolutionsLoaders {
	loader := operationalSolutionsLoaders{}
	loader.init()
	return loader
}

type operationalSolutionsLoaderConfig struct {
	// ByID Returns an operational solution by it's id
	ByID LoaderConfig[uuid.UUID, *models.OperationalSolution]
	// AndPossibleByOperationalNeedID Returns an array of operational solutions, and possible operational solutions by an operational need id. It also will conditionally return needed / not needed
	AndPossibleByOperationalNeedID LoaderConfig[storage.SolutionAndPossibleKey, []*models.OperationalSolution]
}

// OperationalSolutions is the loader config for all operational solution fetching
var OperationalSolutions = operationalSolutionsLoaderConfig{
	ByID: LoaderConfig[uuid.UUID, *models.OperationalSolution]{

		Load:          operationalSolutionGetByIDLoad,
		batchFunction: operationalSolutionGetByIDBatch,
	},
	AndPossibleByOperationalNeedID: LoaderConfig[storage.SolutionAndPossibleKey, []*models.OperationalSolution]{
		Load:          operationalSolutionAndPossibleCollectionGetByOperationalNeedID,
		batchFunction: batchOperationalSolutionAndPossibleCollectionGetByOperationalNeedID,
	},
}

func operationalSolutionGetByIDLoad(ctx context.Context, id uuid.UUID) (*models.OperationalSolution, error) {
	allLoaders, ok := Loaders(ctx)
	if !ok {
		return nil, ErrNoLoaderOnContext
	}
	return allLoaders.operationalSolutions.ByID.Load(ctx, id)()
}

// operationalSolutionGetByIDBatch uses a data loader to return an operational solution by ID
func operationalSolutionGetByIDBatch(
	ctx context.Context,
	ids []uuid.UUID,
) []*dataloader.Result[*models.OperationalSolution] {
	logger := appcontext.ZLogger(ctx)
	output := make([]*dataloader.Result[*models.OperationalSolution], len(ids))
	loaders, ok := Loaders(ctx)
	if !ok {
		for index := range ids {
			output[index] = &dataloader.Result[*models.OperationalSolution]{Data: nil, Error: ErrNoLoaderOnContext}
		}
		return output
	}

	opSols, loadErr := storage.OperationalSolutionGetByIDLOADER(loaders.DataReader.Store, logger, ids)
	if loadErr != nil {
		for index := range ids {
			output[index] = &dataloader.Result[*models.OperationalSolution]{Data: nil, Error: loadErr}
		}
		return output
	}

	opSolsByID := lo.Associate(opSols, func(gc *models.OperationalSolution) (uuid.UUID, *models.OperationalSolution) {
		return gc.ID, gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	for index, key := range ids {

		opSol, ok := opSolsByID[key]
		if ok {
			output[index] = &dataloader.Result[*models.OperationalSolution]{Data: opSol, Error: nil}
		} else {
			err := fmt.Errorf("operational solution not found for id %s", key)
			output[index] = &dataloader.Result[*models.OperationalSolution]{Data: nil, Error: err}
		}

	}

	return output
}
