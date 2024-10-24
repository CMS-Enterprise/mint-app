package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// planDataExchangeApproachLoaders is a struct that holds LoaderWrappers related to Plan Data Exchange Approach
type planDataExchangeApproachLoaders struct {
	// ByModelPlanID Gets a plan data exchange approach record associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, *models.PlanDataExchangeApproach]
}

var PlanDataExchangeApproach = &planDataExchangeApproachLoaders{
	ByModelPlanID: NewLoaderWrapper(batchPlanDataExchangeApproachByModelPlanID),
}

func batchPlanDataExchangeApproachByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.PlanDataExchangeApproach] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.PlanDataExchangeApproach](modelPlanIDs, err)
	}

	data, err := storage.PlanDataExchangeApproachGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, *models.PlanDataExchangeApproach](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.PlanDataExchangeApproach) uuid.UUID {
		return data.ModelPlanID
	}
	return oneToOneDataLoader(modelPlanIDs, data, getKeyFunc)

}
