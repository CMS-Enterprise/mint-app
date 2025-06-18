package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// timelineLoaders is a struct that holds LoaderWrappers related to Timeline
type timelineLoaders struct {
	// ByModelPlanID Gets a timeline record associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, *models.Timeline]
}

// Timeline is the singleton instance of all LoaderWrappers related to Timeline
var Timeline = &timelineLoaders{
	ByModelPlanID: NewLoaderWrapper(batchTimelineGetByModelPlanID),
}

func batchTimelineGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.Timeline] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.Timeline](modelPlanIDs, err)
	}

	data, err := storage.TimelineGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.Timeline](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.Timeline) uuid.UUID {
		return data.ModelPlanID
	}

	return oneToOneDataLoader(modelPlanIDs, data, getKeyFunc)

}
