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

// GetExistingModelByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Existing Model in one query
func (loaders *DataLoaders) GetExistingModelByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Existing Model", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Existing Model", zap.Error(*err))
	}

	eMs, _ := dr.Store.ExistingModelGetByIDLOADER(logger, marshaledParams)
	eMByID := lo.Associate(eMs, func(gc *models.ExistingModel) (string, *models.ExistingModel) {
		return fmt.Sprint(gc.ID), gc
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["id"])
			eM, ok := eMByID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: eM, Error: nil}
			} else {
				err := fmt.Errorf("existing Model not found for id %s", resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
