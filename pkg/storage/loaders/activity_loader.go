package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/notifications"
)

const (
	// DLActivityIDKey is the key used to store and retrieve the activity id key
	DLActivityIDKey string = "id"
)

// activityGetByIDLoaderBatch returns an array of dataloader results for a given set of keys
// it is responsible for translating the data loader keys and returning the ultimate result in a specific order
func (loaders *DataLoaders) activityGetByIDLoaderBatch(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader
	logger := appcontext.ZLogger(ctx)

	jsonParams, err := CovertToJSONArray(keys)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: fmt.Errorf("issue converting keys to json for ActivityGetByIDLoader, %w", err)}}
	}
	orderedIDs := lo.Map(keys, func(key dataloader.Key, _ int) string {
		ck, ok := key.Raw().(KeyArgs)
		if !ok {
			logger.Info("data loader key is the wrong type", zap.Any("key", key))
			//TODO: EASI-3925 how to handle if this doesn't parse? Consider moving some of the key serialization logic to a shared package
			// return []*dataloader.Result{{Data: nil, Error: fmt.Errorf("issue converting keys to uuid[] for ActivityGetByIDLoader, %w")}}
		}
		resKey := fmt.Sprint(ck.Args[DLActivityIDKey])
		return resKey
	})
	return notifications.ActivityGetByIDLoaderThunk(ctx, dr.Store, jsonParams, orderedIDs)

}

// ActivityGetByID returns an activity by it's ID utilizing a data loaders
func ActivityGetByID(ctx context.Context, activityID uuid.UUID) (*notifications.Activity, error) {

	allLoaders := Loaders(ctx)
	activityLoader := allLoaders.ActivityLoader
	key := NewKeyArgs()
	key.Args[DLActivityIDKey] = activityID

	thunk := activityLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*notifications.Activity), nil

}
