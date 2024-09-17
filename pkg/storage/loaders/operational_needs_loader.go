package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// GetOperationalNeedsByModelPlanID uses a data loader to aggregate SQL calls and return data
func (loaders *DataLoaders) GetOperationalNeedsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Operational Solutions", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Operational Solutions", zap.Error(*err))
	}

	dr := loaders.DataReader

	opNeeds, _ := dr.Store.OperationalNeedCollectionGetByModelPlanIDLOADER(logger, marshaledParams)
	opNeedsByID := map[string][]*models.OperationalNeed{}
	for _, opNeed := range opNeeds {

		slice, ok := opNeedsByID[string(opNeed.ModelPlanID.String())]
		if ok {
			slice = append(slice, opNeed) //Add to existing slice
			opNeedsByID[string(opNeed.ModelPlanID.String())] = slice
			continue
		}
		opNeedsByID[string(opNeed.ModelPlanID.String())] = []*models.OperationalNeed{opNeed}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			needs, ok := opNeedsByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: needs, Error: nil}
			} else {
				err := fmt.Errorf("operational needs not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}

	}
	return output

}
