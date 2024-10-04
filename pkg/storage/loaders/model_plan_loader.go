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

// modelPlanLoaders is a struct that holds LoaderWrappers related to Model Plans
type modelPlanLoaders struct {
	// GetByID returns a model plan record associated with a uuid
	GetByID LoaderWrapper[uuid.UUID, *models.ModelPlan]
}

// ModelPlan is the singleton instance of all LoaderWrappers related to Model Plans
var ModelPlan = &modelPlanLoaders{
	GetByID: NewLoaderWrapper(batchModelPlanByModelPlanID),
}

func batchModelPlanByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.ModelPlan] {
	logger := appcontext.ZLogger(ctx)
	output := make([]*dataloader.Result[*models.ModelPlan], len(modelPlanIDs))
	loaders, err := Loaders(ctx)
	if err != nil {
		//TODO: (loaders) make this a helper function to return an error per result
		for index := range modelPlanIDs {
			output[index] = &dataloader.Result[*models.ModelPlan]{Data: nil, Error: err}
		}
		return output
	}

	data, err := storage.ModelPlansGetByModePlanIDsLOADER(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		//TODO: (loaders) make this a helper function to return an error per result
		for index := range modelPlanIDs {
			output[index] = &dataloader.Result[*models.ModelPlan]{Data: nil, Error: err}
		}
		return output
	}
	planByID := lo.Associate(data, func(plan *models.ModelPlan) (uuid.UUID, *models.ModelPlan) {
		return plan.ID, plan
	})

	// RETURN IN THE SAME ORDER REQUESTED
	for index, id := range modelPlanIDs {

		plan, ok := planByID[id]
		if ok {
			output[index] = &dataloader.Result[*models.ModelPlan]{Data: plan, Error: nil}
		} else {
			err2 := fmt.Errorf("model plan not found for modelPlanID id %s", id)
			output[index] = &dataloader.Result[*models.ModelPlan]{Data: nil, Error: err2}
		}
	}
	return output
}
