package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// customTimelineDateLoaders is a struct that holds LoaderWrappers related to Custom Timeline Dates
type customTimelineDateLoaders struct {
	// ByModelPlanID gets custom timeline dates associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.CustomTimelineDate]
	// ByID gets a custom timeline date by the supplied ID
	ByID LoaderWrapper[uuid.UUID, *models.CustomTimelineDate]
}

// CustomTimelineDate is the singleton instance of all LoaderWrappers related to Custom Timeline Dates
var CustomTimelineDate = &customTimelineDateLoaders{
	ByModelPlanID: NewLoaderWrapper(batchCustomTimelineDateGetByModelPlanID),
	ByID:          NewLoaderWrapper(batchCustomTimelineDateGetByID),
}

func batchCustomTimelineDateGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.CustomTimelineDate] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CustomTimelineDate](modelPlanIDs, err)
	}

	data, err := storage.CustomTimelineDateGetByModelPlanIDLoader(loaders.DataReader.Store, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CustomTimelineDate](modelPlanIDs, err)
	}

	getKeyFunc := func(data *models.CustomTimelineDate) uuid.UUID {
		return data.ModelPlanID
	}

	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}

func batchCustomTimelineDateGetByID(ctx context.Context, ids []uuid.UUID) []*dataloader.Result[*models.CustomTimelineDate] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.CustomTimelineDate](ids, err)
	}

	data, err := storage.CustomTimelineDateGetByIDLoader(loaders.DataReader.Store, ids)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.CustomTimelineDate](ids, err)
	}

	getKeyFunc := func(data *models.CustomTimelineDate) uuid.UUID {
		return data.ID
	}

	return oneToOneDataLoader(ids, data, getKeyFunc)
}
