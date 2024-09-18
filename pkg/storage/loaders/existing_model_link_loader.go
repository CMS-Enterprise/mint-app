package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// GetExistingModelLinkNamesByModelPlanIDAndFieldName uses a DataLoader to aggreggate a SQL call and return all Existing Model Link Names in one query for a given model_plan_id and field_name combination
func (loaders *DataLoaders) GetExistingModelLinkNamesByModelPlanIDAndFieldName(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
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

	links, _ := dr.Store.GetExistingModelLinkNamesByModelPlanIDAndFieldNameLOADER(logger, marshaledParams)
	nameArrayByResKey := map[string][]string{} //Only get the names from the links structure
	for _, link := range links {
		resKey := fmt.Sprint(link.ModelPlanID, link.FieldName) //The key is a compound key, the model_plan_id, and the field name
		nameArrayByResKey[resKey] = link.NameArray
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"], ck.Args["field_name"])
			links := nameArrayByResKey[resKey] //Any not found will return an empty array

			output[index] = &dataloader.Result{Data: links, Error: nil}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

// GetExistingModelLinkByModelPlanIDAndFieldName uses a DataLoader to aggreggate a SQL call and return all Existing Model Link in one query for a given model_plan_id and field_name
func (loaders *DataLoaders) GetExistingModelLinkByModelPlanIDAndFieldName(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
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
