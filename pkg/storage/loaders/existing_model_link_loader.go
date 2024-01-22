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

	// TODO: update this to get the link by id and field, not just by modelPlanID
	links, _ := dr.Store.ExistingModelLinkGetByModelPlanIDAndFieldNameLOADER(logger, marshaledParams)
	linksByID := map[string][]*models.ExistingModelLink{}
	for _, link := range links {
		resKey := fmt.Sprint(link.ModelPlanID, link.FieldName) //The key is a compound key, the model_plan_id, and the field name
		slice, ok := linksByID[resKey]
		if ok {
			slice = append(slice, link) //Add to existing slice
			linksByID[resKey] = slice
			continue
		}
		linksByID[resKey] = []*models.ExistingModelLink{link}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"], ck.Args["field_name"])
			links := linksByID[resKey] //Any not found will return an empty array

			output[index] = &dataloader.Result{Data: links, Error: nil}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
