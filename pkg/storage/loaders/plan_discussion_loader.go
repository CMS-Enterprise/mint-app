package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// planBasicsLoaders is a struct that holds LoaderWrappers related to Plan Discussions
type planDiscussionLoaders struct {
	// ByModelPlanID Gets a list of plan discussion records associated with a model plan by the supplied model plan id
	ByModelPlanID LoaderWrapper[uuid.UUID, []*models.PlanDiscussion]
}

// PlanDiscussion is the singleton instance of all LoaderWrappers related to Plan Discussions
var PlanDiscussion = &planDiscussionLoaders{
	ByModelPlanID: NewLoaderWrapper(batchPlanDiscussionGetByModelPlanID),
}

// // GetPlanDiscussionByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Plan Discussion in one query
// func (loaders *DataLoaders) GetPlanDiscussionByModelPlanID(ctx context.Context, keys dataloaderOld.Keys) []*dataloaderOld.Result {
// 	dr := loaders.DataReader

// 	logger := appcontext.ZLogger(ctx)
// 	arrayCK, err := ConvertToKeyArgsArray(keys)
// 	if err != nil {
// 		logger.Error("issue converting keys for data loader in Plan Discussion", zap.Error(*err))
// 	}
// 	marshaledParams, err := arrayCK.ToJSONArray()
// 	if err != nil {
// 		logger.Error("issue converting keys to JSON for data loader in Plan Discussion", zap.Error(*err))
// 	}

// 	discs, _ := dr.Store.PlanDiscussionGetByModelPlanIDLOADER(logger, marshaledParams)
// 	discsByID := map[string][]*models.PlanDiscussion{}

// 	for _, disc := range discs {

// 		slice, ok := discsByID[string(disc.ModelPlanID.String())]
// 		if ok {
// 			slice = append(slice, disc) //Add to existing slice
// 			discsByID[string(disc.ModelPlanID.String())] = slice
// 			continue
// 		}
// 		discsByID[string(disc.ModelPlanID.String())] = []*models.PlanDiscussion{disc}
// 	}

// 	// RETURN IN THE SAME ORDER REQUESTED
// 	output := make([]*dataloaderOld.Result, len(keys))
// 	for index, key := range keys {
// 		ck, ok := key.Raw().(KeyArgs)
// 		if ok {
// 			resKey := fmt.Sprint(ck.Args["model_plan_id"])
// 			discs := discsByID[resKey] // if discussion not found, empty array
// 			output[index] = &dataloaderOld.Result{Data: discs, Error: nil}
// 		} else {
// 			err := fmt.Errorf("could not retrive key from %s", key.String())
// 			output[index] = &dataloaderOld.Result{Data: nil, Error: err}
// 		}
// 	}
// 	return output

// }

func batchPlanDiscussionGetByModelPlanID(ctx context.Context, modelPlanIDs []uuid.UUID) []*dataloader.Result[[]*models.PlanDiscussion] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.PlanDiscussion](modelPlanIDs, err)
	}

	data, err := storage.PlanDiscussionGetByModelPlanIDLOADER(loaders.DataReader.Store, logger, modelPlanIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.PlanDiscussion](modelPlanIDs, err)
	}
	getKeyFunc := func(data *models.PlanDiscussion) uuid.UUID {
		return data.ModelPlanID
	}

	// implement one to many
	return oneToManyDataLoaderFuncSimplified(modelPlanIDs, data, getKeyFunc)

}
