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

// GetPlanPaymentsByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Plan Payments in one query
func (loaders *DataLoaders) GetPlanPaymentsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Plan Payments", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Plan Payments", zap.Error(*err))
	}

	pays, _ := dr.Store.PlanPaymentsGetByModelPlanIDLOADER(logger, marshaledParams)
	payByID := lo.Associate(pays, func(gc *models.PlanPayments) (string, *models.PlanPayments) {
		return gc.ModelPlanID.String(), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			pay, ok := payByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: pay, Error: nil}
			} else {
				err := fmt.Errorf("plan Payments not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
