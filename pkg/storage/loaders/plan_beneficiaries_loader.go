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

// GetPlanBeneficiariesByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Plan Beneficiaries in one query
func (loaders *DataLoaders) GetPlanBeneficiariesByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Plan Beneficiaries", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Plan Beneficiaries", zap.Error(*err))
	}

	benes, _ := dr.Store.PlanBeneficiariesGetByModelPlanIDLOADER(logger, marshaledParams)
	benesByID := lo.Associate(benes, func(gc *models.PlanBeneficiaries) (string, *models.PlanBeneficiaries) {
		return gc.ModelPlanID.String(), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			bene, ok := benesByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: bene, Error: nil}
			} else {
				err := fmt.Errorf("plan Beneficiaries not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
