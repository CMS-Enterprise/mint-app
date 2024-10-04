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
	output := make([]*dataloader.Result[*models.PlanBasics], len(modelPlanIDs))
	loaders, err := Loaders(ctx)
	if err != nil {
		for index := range modelPlanIDs {
			output[index] = &dataloader.Result[*models.PlanBasics]{Data: nil, Error: err}
		}
		return output
	}

	data, err := storage.PlanBasicsGetByModelPlanIDLoader(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {

		for index := range modelPlanIDs {
			output[index] = &dataloader.Result[*models.PlanBasics]{Data: nil, Error: err}
		}
		return output
	}
	basicsByModelPlanID := lo.Associate(data, func(basics *models.PlanBasics) (uuid.UUID, *models.PlanBasics) {
		return basics.ModelPlanID, basics
	})

	// RETURN IN THE SAME ORDER REQUESTED

	for index, id := range modelPlanIDs {

		basics, ok := basicsByModelPlanID[id]
		if ok {
			output[index] = &dataloader.Result[*models.PlanBasics]{Data: basics, Error: nil}
		} else {
			err2 := fmt.Errorf("plan basics not found for modelPlanID id %s", id)
			output[index] = &dataloader.Result[*models.PlanBasics]{Data: nil, Error: err2}
		}
	}
	return output

}
