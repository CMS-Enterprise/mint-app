package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoSolutionLoaders is a struct that holds LoaderWrappers related to MTO Solutions
type mtoSolutionLoaders struct {
	// ByModelPlanID Gets a list of mto Solution records associated with a model plan by the supplied model plan id.
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.MTOSolution]
}

// MTOSolution is the singleton instance of all LoaderWrappers related to MTO Solutions
var MTOSolution = &mtoSolutionLoaders{
	ByModelPlanID: NewLoaderWrapper(batchMTOSolutionGetByModelPlanID),
}

func batchMTOSolutionGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOSolution] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSolution](modelPlanIDs, err)
	}

	data, err := storage.MTOSolutionGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSolution](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.MTOSolution) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}
