package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// GetModelPlanByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Model Plan in one query
func (loaders *DataLoaders) GetModelPlanByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
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
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			plan, ok := planByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: plan, Error: nil}
			} else {
				err := fmt.Errorf("model Plan not found for id %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

// GetModelPlanByModelPlanID uses a data loader to return a model plan for a given model plan
func GetModelPlanByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) (*models.ModelPlan, error) {
	loadgen, ok := loadgensFromCTX(ctx)
	if !ok {
		return nil, fmt.Errorf("unexpected nil loaders in GetModelPlanByModelPlanID")
	}

	return loadgen.GetModelPlanByModelPlanID.Load(ctx, modelPlanID)

}

func (dl *DataLoadgens) batchModelPlanByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) ([]*models.ModelPlan, []error) {
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
