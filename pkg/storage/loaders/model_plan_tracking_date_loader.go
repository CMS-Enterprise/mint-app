package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
)

// GetModelPlanTrackingDateByModelPlanID uses a DataLoader to aggregate a SQL call and return the Model Plan Tracking Date in one query
func (loaders *DataLoaders) GetModelPlanTrackingDateByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Model Plan Tracking Date", zap.Error(*err))
		return nil
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Model Plan Tracking Date", zap.Error(*err))
		return nil
	}

	trackingDates, _ := dr.Store.ModelPlanTrackingDateGetByModelPlanIDLOADER(logger, marshaledParams)

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			if planDate, ok := trackingDates[resKey]; ok {
				output[index] = &dataloader.Result{Data: &planDate, Error: nil}
			} else {
				err := fmt.Errorf("tracking date not found for id %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}

	return output
}
