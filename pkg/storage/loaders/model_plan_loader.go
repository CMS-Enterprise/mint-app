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

// modelPlanLoaderConfig is the loader config for all fetching of model plan data
type modelPlanLoaderConfig struct {
	// GetByID returns a model plan record associated with a uuid
	GetByID LoaderConfig[uuid.UUID, *models.ModelPlan]
}

// ModelPlan is the loader config for all fetching of model plan data
var ModelPlan = func() modelPlanLoaderConfig {
	config := modelPlanLoaderConfig{
		GetByID: LoaderConfig[uuid.UUID, *models.ModelPlan]{
			batchFunction: batchModelPlanByModelPlanID,
		},
	}
	config.GetByID.init()
	return config
}()

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
