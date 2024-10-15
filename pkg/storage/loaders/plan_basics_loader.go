package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// planBasicsLoaders is a struct that holds LoaderWrappers related to Plan Basics
type planBasicsLoaders struct {
	// ByModelPlanID Gets a plan basics record associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, *models.PlanBasics]
}

// PlanBasics is the singleton instance of all LoaderWrappers related to Plan Basics
var PlanBasics = &planBasicsLoaders{
	ByModelPlanID: NewLoaderWrapper(batchPlanBasicsGetByModelPlanID),
}

func batchPlanBasicsGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.PlanBasics] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.PlanBasics](modelPlanIDs, err)
	}

	data, err := storage.PlanBasicsGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.PlanBasics](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.PlanBasics) uuid.UUID {
		return data.ModelPlanID
	}

	return oneToOneDataLoaderFunc(modelPlanIDs, data, getKeyFunc)

}
