package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
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
