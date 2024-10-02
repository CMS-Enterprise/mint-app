package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
)

const (
	// DLActivityIDKey is the key used to store and retrieve the activity id key
	DLActivityIDKey string = "id"
)

// activityGetByIDLoaderBatch returns an array of dataloader results for a given set of keys
// it is responsible for translating the data loader keys and returning the ultimate result in a specific order
func (loaders *DataLoaders) activityGetByIDLoaderBatch(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	dr := loaders.DataReader

	jsonParams, err := CovertToJSONArray(keys)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: fmt.Errorf("issue converting keys to json for ActivityGetByIDLoader, %w", err)}}
	}
	var orderedIDerr error
	orderedIDs := lo.Map(keys, func(key dataloader.Key, _ int) string {
		ck, ok := key.Raw().(KeyArgs)
		if !ok {
			err = fmt.Errorf("data loader key is the wrong type, %v", key)
			orderedIDerr = err
		}
		resKey := fmt.Sprint(ck.Args[DLActivityIDKey])
		return resKey
	})
	if orderedIDerr != nil {
		return []*dataloader.Result{{Data: nil, Error: fmt.Errorf("issue converting keys to ordered list for ActivityGetByIDLoader, %w", orderedIDerr)}}
	}
	return notifications.ActivityGetByIDLoaderThunk(ctx, dr.Store, jsonParams, orderedIDs)

}

// ActivityGetByID returns an activity by it's ID utilizing a data loaders
func ActivityGetByID(ctx context.Context, activityID uuid.UUID) (*models.Activity, error) {

	allLoaders, ok := Loaders(ctx)
	if !ok {
		return nil, ErrNoLoaderOnContext
	}
	activityLoader := allLoaders.ActivityLoader
	key := NewKeyArgs()
	key.Args[DLActivityIDKey] = activityID

	thunk := activityLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.Activity), nil

}
