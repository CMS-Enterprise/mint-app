package loaders

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"
)

// modelPlanRecentlyCreatedLoaders is a struct that holds LoaderWrappers related to Model Plan Recently Created
type modelPlanRecentlyCreatedLoaders struct {
	// ByModelPlanID Gets a model plan recently created record associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, *models.ModelPlan]
}

// ModelPlanRecentlyCreated is the singleton instance of all LoaderWrappers related to recently created Model Plans
var ModelPlanRecentlyCreated = &modelPlanRecentlyCreatedLoaders{
	ByModelPlanID: NewLoaderWrapper(batchModelPlanRecentlyCreatedByModelPlanID),
}

func batchModelPlanRecentlyCreatedByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.ModelPlan] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.ModelPlan](modelPlanIDs, err)
	}

	data, err := loaders.DataReader.Store.ModelPlanCollectionGetRecentlyCreatedLOADER(logger)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.ModelPlan](modelPlanIDs, err)
	}
	getKeyFunc := func(modelPlan *models.ModelPlan) uuid.UUID {
		return modelPlan.ID
	}
	return oneToOneDataLoader(modelPlanIDs, data, getKeyFunc)
}
