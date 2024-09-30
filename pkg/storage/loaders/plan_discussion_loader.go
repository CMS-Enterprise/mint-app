package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// GetPlanDiscussionByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Plan Discussion in one query
func (loaders *DataLoaders) GetPlanDiscussionByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Plan Discussion", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Plan Discussion", zap.Error(*err))
	}

	discs, _ := dr.Store.PlanDiscussionGetByModelPlanIDLOADER(logger, marshaledParams)
	discsByID := map[string][]*models.PlanDiscussion{}

	for _, disc := range discs {

		slice, ok := discsByID[string(disc.ModelPlanID.String())]
		if ok {
			slice = append(slice, disc) //Add to existing slice
			discsByID[string(disc.ModelPlanID.String())] = slice
			continue
		}
		discsByID[string(disc.ModelPlanID.String())] = []*models.PlanDiscussion{disc}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["model_plan_id"])
			discs := discsByID[resKey] // if discussion not found, empty array
			output[index] = &dataloader.Result{Data: discs, Error: nil}
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
