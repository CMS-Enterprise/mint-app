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

type planBasicsLoaders struct {
	ByModelPlanID *dataloader.Loader[uuid.UUID, *models.PlanBasics]
}

// TODO: (loaders) make a generic method to initialize these methods?
func (l *planBasicsLoaders) init() {
	l.ByModelPlanID = PlanBasics.GetByModelPlanID.NewBatchedLoader()
}

func newPlanBasicsLoaders() planBasicsLoaders {
	loader := planBasicsLoaders{}
	loader.init()
	return loader
}

type planBasicsLoaderConfig struct {
	// GetByModelPlanID Gets a plan basics record associated with a model plan by the supplied model plan id
	GetByModelPlanID LoaderConfig[uuid.UUID, *models.PlanBasics]
}

// PlanBasics is the loader config for all  plan basics fetching operations
var PlanBasics planBasicsLoaderConfig = planBasicsLoaderConfig{
	GetByModelPlanID: LoaderConfig[uuid.UUID, *models.PlanBasics]{
		Load:          planBasicsGetByModelPlanIDLoad, // Direct assignment
		batchFunction: batchPlanBasicsGetByModelPlanID,
		// getExistingBatchFunction: ,
	},
}

func batchPlanBasicsGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.PlanBasics] {
	logger := appcontext.ZLogger(ctx)
	output := make([]*dataloader.Result[*models.PlanBasics], len(modelPlanIDs))
	loaders := Loaders(ctx)

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

func planBasicsGetByModelPlanIDLoad(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanBasics, error) {
	allLoaders := Loaders(ctx)
	basicsLoader := allLoaders.planBasics.ByModelPlanID
	return basicsLoader.Load(ctx, modelPlanID)()
}
