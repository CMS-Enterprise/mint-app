package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
)

// GetExistingModelLinkByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Existing Model Link in one query
func (loaders *DataLoaders) GetExistingModelLinkByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Existing Model Link", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Existing Model Link", zap.Error(*err))
	}

	links, _ := dr.Store.ExistingModelLinkGetByModelPlanIDLOADER(logger, marshaledParams)
	linksByID := map[string][]*models.ExistingModelLink{}
	for _, link := range links {
		slice, ok := linksByID[string(link.ModelPlanID.String())]
		if ok {
			slice = append(slice, link) //Add to existing slice
			linksByID[string(link.ModelPlanID.String())] = slice
			continue
		}
		linksByID[string(link.ModelPlanID.String())] = []*models.ExistingModelLink{link}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			links := linksByID[resKey] //Any not found will return an empty array

			output[index] = &dataloader.Result{Data: links, Error: nil}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
