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

// GetPlanOpsEvalAndLearningByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Plan Operations Evaluation And Learning in one query
func (loaders *DataLoaders) GetPlanOpsEvalAndLearningByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Plan Operations Evaluation And Learning", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Plan Operations Evaluation And Learning", zap.Error(*err))
	}

	oels, _ := dr.Store.PlanOpsEvalAndLearningGetByModelPlanIDLOADER(logger, marshaledParams)
	oelByID := lo.Associate(oels, func(gc *models.PlanOpsEvalAndLearning) (string, *models.PlanOpsEvalAndLearning) {
		return gc.ModelPlanID.String(), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			oel, ok := oelByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: oel, Error: nil}
			} else {
				err := fmt.Errorf("plan Operations Evaluation And Learning not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
