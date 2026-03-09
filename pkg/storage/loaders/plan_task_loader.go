package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// planTaskLoaders is a struct that holds LoaderWrappers related to Plan Tasks
type planTaskLoaders struct {
	// ByModelPlanID Gets a list of plan tasks associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.PlanTask]
}

// PlanTask is the singleton instance of all LoaderWrappers related to Plan Tasks
var PlanTask = &planTaskLoaders{
	ByModelPlanID: NewLoaderWrapper(batchPlanTaskGetByModelPlanID),
}

func batchPlanTaskGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.PlanTask] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.PlanTask](modelPlanIDs, err)
	}

	data, err := storage.PlanTaskGetByModelPlanIDLOADER(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.PlanTask](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.PlanTask) uuid.UUID {
		return data.ModelPlanID
	}

	return oneToManyDataLoader(modelPlanIDs, data, getKeyFunc)
}
