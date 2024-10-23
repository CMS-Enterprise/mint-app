package loaders

import (
	"context"

	"github.com/google/uuid"

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
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.OperationalSolution](ids, err)
	}

	opSols, loadErr := storage.OperationalSolutionGetByIDLOADER(loaders.DataReader.Store, logger, ids)
	if loadErr != nil {
		return errorPerEachKey[uuid.UUID, *models.OperationalSolution](ids, loadErr)
	}
	getKeyFunc := func(data *models.OperationalSolution) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, opSols, getKeyFunc)

}
