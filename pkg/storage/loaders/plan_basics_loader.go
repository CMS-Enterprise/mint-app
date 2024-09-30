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

// GetPlanBasicsByModelPlanID uses a DataLoader to aggreggate a SQL call and return all plan basics in one query
func (loaders *DataLoaders) GetPlanBasicsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Plan Basics", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Plan Basics", zap.Error(*err))
	}

	basics, _ := dr.Store.PlanBasicsGetByModelPlanIDLOADER(logger, marshaledParams)
	basicsByID := lo.Associate(basics, func(b *models.PlanBasics) (string, *models.PlanBasics) {
		return b.ModelPlanID.String(), b
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			basic, ok := basicsByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: basic, Error: nil}
			} else {
				err := fmt.Errorf("plan basic not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
