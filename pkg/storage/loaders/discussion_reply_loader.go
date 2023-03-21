package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
)

// GetDiscussionReplyByModelPlanID uses a DataLoader to aggreggate a SQL call and return all Discussion Reply in one query
func (loaders *DataLoaders) GetDiscussionReplyByModelPlanID(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	logger := appcontext.ZLogger(ctx)
	arrayCK, err := ConvertToKeyArgsArray(keys)
	if err != nil {
		logger.Error("issue converting keys for data loader in Discussion Reply", zap.Error(*err))
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		logger.Error("issue converting keys to JSON for data loader in Discussion Reply", zap.Error(*err))
	}

	discRs, _ := dr.Store.DiscussionReplyGetByDiscussionIDLOADER(logger, marshaledParams)
	discRByID := lo.Associate(discRs, func(dr *models.DiscussionReply) (string, *models.DiscussionReply) {
		return dr.DiscussionID.String(), dr
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args["discussion_id"])
			discR := discRByID[resKey]
			output[index] = &dataloader.Result{Data: discR, Error: nil} // not found means an empty array as expected
		} else {
			err := fmt.Errorf("could not retrive key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
