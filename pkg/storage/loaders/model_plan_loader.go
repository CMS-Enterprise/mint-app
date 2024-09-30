package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	dataloaderOld "github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

type modelPlanLoader struct {
	ByID *dataloader.Loader[uuid.UUID, *models.ModelPlan]
}

func (l *modelPlanLoader) init() {
	l.ByID = ModelPlan.GetByID.NewBatchedLoader()
}

func newModelPlanLoaders() modelPlanLoader {
	loader := modelPlanLoader{}
	loader.init()
	return loader
}

type modelPlanLoaderConfig struct {
	GetByID LoaderConfig[uuid.UUID, *models.ModelPlan]
}

var ModelPlan modelPlanLoaderConfig = modelPlanLoaderConfig{
	GetByID: LoaderConfig[uuid.UUID, *models.ModelPlan]{
		Note:          "Gets a model plan record associated with a uuid",
		Load:          modelPlanGetByIDLoad,
		batchFunction: batchModelPlanByModelPlanID,
	},
}

// GetModelPlanByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Model Plan in one query
func (loaders *DataLoaders) GetModelPlanByModelPlanID(ctx context.Context, keys dataloaderOld.Keys) []*dataloaderOld.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Model Plan", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Model Plan", zap.Error(*err))
	}

	plans, _ := dr.Store.ModelPlanGetByModelPlanIDLOADER(logger, marshaledParams)
	planByID := lo.Associate(plans, func(gc *models.ModelPlan) (string, *models.ModelPlan) {
		return gc.ID.String(), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloaderOld.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			plan, ok := planByID[resKey]
			if ok {
				output[index] = &dataloaderOld.Result{Data: plan, Error: nil}
			} else {
				err := fmt.Errorf("model Plan not found for id %s", resKey)
				output[index] = &dataloaderOld.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloaderOld.Result{Data: nil, Error: err}
		}
	}
	return output

}

// ModelPlanGetByIDLOADGEN uses a data loader to return a model plan for a given model plan
func ModelPlanGetByIDLOADGEN(ctx context.Context, modelPlanID uuid.UUID) (*models.ModelPlan, error) {
	loadgen, ok := loadgensFromCTX(ctx)
	if !ok {
		return nil, fmt.Errorf("unexpected nil loaders in GetModelPlanByModelPlanID")
	}

	return loadgen.ModelPlanByModelPlanID.Load(ctx, modelPlanID)

}

func (dl *DataLoadgens) batchModelPlanByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) ([]*models.ModelPlan, []error) {
	// TODO remove this if we don't use this library
	logger := appcontext.ZLogger(ctx)
	data, err := storage.ModelPlansGetByModePlanIDsLOADER(dl.dataReader.Store, logger, modelPlanIDs)
	if err != nil {
		// TODO: verify that this works as anticipated
		return nil, []error{err}
	}
	planByID := lo.Associate(data, func(plan *models.ModelPlan) (uuid.UUID, *models.ModelPlan) {
		return plan.ID, plan
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*models.ModelPlan, len(modelPlanIDs))
	errOutput := make([]error, len(modelPlanIDs))

	for index, id := range modelPlanIDs {

		plan, ok := planByID[id]
		if ok {
			output[index] = plan
			errOutput[index] = nil
		} else {
			output[index] = plan
			errOutput[index] = fmt.Errorf("model Plan not found for id %s", id)
		}
	}
	return output, errOutput
}

func batchModelPlanByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[*models.ModelPlan] {
	logger := appcontext.ZLogger(ctx)
	output := make([]*dataloader.Result[*models.ModelPlan], len(modelPlanIDs))
	loaders := Loaders(ctx)

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

// modelPlanGetByIDLoad uses a data loader to return a model plan for a given model plan
func modelPlanGetByIDLoad(ctx context.Context, id uuid.UUID) (*models.ModelPlan, error) {
	allLoaders := Loaders(ctx)
	modelPlanLoader := allLoaders.modelPlan.ByID
	return modelPlanLoader.Load(ctx, id)()
}
