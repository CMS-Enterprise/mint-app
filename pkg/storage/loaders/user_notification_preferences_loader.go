package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

const (
	// DLUserNotificationPreferencesKey is the key used to store and retrieve the user notification preferences id key
	DLUserNotificationPreferencesKey string = "user_id"
)

// userNotificationPreferencesGetByUserIDBatch returns an array of dataloader results for a given set of keys
func (loaders *DataLoaders) userNotificationPreferencesGetByUserIDBatch(_ context.Context, keys dataloader.Keys) []*dataloader.Result {

	jsonParams, err := CovertToJSONArray(keys)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: fmt.Errorf("issue converting keys to json for UserNotificationPreferencesGetByUserIDLoader, %w", err)}}
	}

	preferences, err := storage.UserNotificationPreferencesGetByUserIDLoader(loaders.DataReader.Store, jsonParams)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: err}}
	}

	preferencesByUserID := lo.Associate(preferences, func(p *models.UserNotificationPreferences) (string, *models.UserNotificationPreferences) {
		return p.UserID.String(), p
	})

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args[DLUserNotificationPreferencesKey])
			preference, ok := preferencesByUserID[resKey]
			if ok {
				output[index] = &dataloader.Result{Data: preference, Error: nil}
			} else {
				err := fmt.Errorf("user notification preferences not found for %s %s", DLUserNotificationPreferencesKey, resKey)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
		} else {
			err := fmt.Errorf("could not retrieve %s key from %s", DLUserNotificationPreferencesKey, key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

// UserNotificationPreferencesGetByUserID returns a user notification preferences object by a user id utilizing a data loader
func UserNotificationPreferencesGetByUserID(ctx context.Context, userID uuid.UUID) (*models.UserNotificationPreferences, error) {

	allLoaders, ok := Loaders(ctx)
	if !ok {
		return nil, ErrNoLoaderOnContext
	}
	UserNotificationPreferencesLoader := allLoaders.UserNotificationPreferencesLoader
	key := NewKeyArgs()
	key.Args[DLUserNotificationPreferencesKey] = userID

	thunk := UserNotificationPreferencesLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}
	return result.(*models.UserNotificationPreferences), nil

}
