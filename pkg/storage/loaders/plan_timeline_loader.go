package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// planTimelineLoaders is a struct that holds LoaderWrappers related to PlanTimeline
type planTimelineLoaders struct {
	// ByModelPlanID Gets a planTimeline record associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, *models.PlanTimeline]
}

// PlanTimeline is the singleton instance of all LoaderWrappers related to PlanTimeline
var PlanTimeline = &planTimelineLoaders{
	ByModelPlanID: NewLoaderWrapper(batchPlanTimelineGetByModelPlanID),
}

func batchPlanTimelineGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.PlanTimeline] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.PlanTimeline](modelPlanIDs, err)
	}

	data, err := storage.PlanTimelineGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.PlanTimeline](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.PlanTimeline) uuid.UUID {
		return data.ModelPlanID
	}

	return oneToOneDataLoader(modelPlanIDs, data, getKeyFunc)

}
