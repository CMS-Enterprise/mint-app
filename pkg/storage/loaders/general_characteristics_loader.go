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

// GetPlanGeneralCharacteristicsByModelPlanID uses a DataLoader to aggreggate a SQL call and return all general characteristics in one query
func (loaders *DataLoaders) GetPlanGeneralCharacteristicsByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in General Characteristics", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in General Characteristics", zap.Error(*err))
	}

	genChars, _ := dr.Store.PlanGeneralCharacteristicsGetByModelPlanIDLOADER(logger, marshaledParams)
	gcByID := lo.Associate(genChars, func(gc *models.PlanGeneralCharacteristics) (string, *models.PlanGeneralCharacteristics) {
		return gc.ModelPlanID.String(), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			genChar, ok := gcByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: genChar, Error: nil}
			} else {
				err := fmt.Errorf("general characterstics not found for model plan %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
