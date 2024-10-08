package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/samber/lo"

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
	output := make([]*dataloader.Result[*models.PlanDataExchangeApproach], len(modelPlanIDs))
	loaders, err := Loaders(ctx)
	if err != nil {
		for index := range modelPlanIDs {
			output[index] = &dataloader.Result[*models.PlanDataExchangeApproach]{Data: nil, Error: err}
		}
		return output
	}

	// TODO, when sorting and erroring utilities are merged to main, replace these functions with them
	data, err := storage.PlanDataExchangeApproachGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {

		for index := range modelPlanIDs {
			output[index] = &dataloader.Result[*models.PlanDataExchangeApproach]{Data: nil, Error: err}
		}
		return output
	}

	approachByModelPlanID := lo.Associate(data, func(data *models.PlanDataExchangeApproach) (uuid.UUID, *models.PlanDataExchangeApproach) {
		return data.ModelPlanID, data
	})

	// TODO (loaders) implement the generic sorting functionality once it is merged to main

	// RETURN IN THE SAME ORDER REQUESTED
	for index, id := range modelPlanIDs {

		data, ok := approachByModelPlanID[id]
		if ok {
			output[index] = &dataloader.Result[*models.PlanDataExchangeApproach]{Data: data, Error: nil}
		} else {
			err2 := fmt.Errorf("plan data exchange approach not found for modelPlanID id %s", id)
			output[index] = &dataloader.Result[*models.PlanDataExchangeApproach]{Data: nil, Error: err2}
		}
	}
	return output

}
