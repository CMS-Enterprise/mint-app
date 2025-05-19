package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoInfoLoaders is a struct that holds LoaderWrappers related to MTO Infos
type mtoInfoLoaders struct {

	// ByModelPlanID Gets a list of mto Info records associated with a model plan by the supplied model plan id (which is the same as the id).
	ByModelPlanID LoaderWrapper[uuid.UUID, *models.MTOInfo]
}

// MTOInfo is the singleton instance of all LoaderWrappers related to MTO Infos
var MTOInfo = &mtoInfoLoaders{
	ByModelPlanID: NewLoaderWrapper(batchMTOInfoGetByModelPlanID),
}

// batchMTOInfoGetByModelPlanID combines all provided keys and sorts and returns the results from the data loader
func batchMTOInfoGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.MTOInfo] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOInfo](modelPlanIDs, err)
	}
	data, err := storage.MTOInfoGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.MTOInfo](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.MTOInfo) uuid.UUID {
		return data.ModelPlanID
	}

	// sort and return the result
	return oneToOneDataLoader(modelPlanIDs, data, getKeyFunc)
}
