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

// operationalSolutionLoaders is a struct that holds LoaderWrappers related to Operational Solutions
type operationalSolutionLoaders struct {
	// ByID Returns an operational solution by it's id
	ByID LoaderWrapper[uuid.UUID, *models.OperationalSolution]
	// AndPossibleByOperationalNeedID Returns an array of operational solutions, and possible operational solutions by an operational need id. It also will conditionally return needed / not needed
	AndPossibleByOperationalNeedID LoaderWrapper[storage.SolutionAndPossibleKey, []*models.OperationalSolution]
}

// OperationalSolutions is the singleton instance of all LoaderWrappers related to Operational Solutions
var OperationalSolutions = &operationalSolutionLoaders{
	ByID:                           NewLoaderWrapper(operationalSolutionGetByIDBatch),
	AndPossibleByOperationalNeedID: NewLoaderWrapper(batchOperationalSolutionAndPossibleCollectionGetByOperationalNeedID),
}

// operationalSolutionGetByIDBatch uses a data loader to return an operational solution by ID
func operationalSolutionGetByIDBatch(
	ctx context.Context,
	ids []uuid.UUID,
) []*dataloader.Result[*models.OperationalSolution] {
	logger := appcontext.ZLogger(ctx)
	output := make([]*dataloader.Result[*models.OperationalSolution], len(ids))
	loaders, err := Loaders(ctx)
	if err != nil {
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
