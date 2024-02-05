package resolvers

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ActivityCreate creates a new activity in the database
func ActivityCreate(ctx context.Context, store *storage.Store, np sqlutils.NamedPreparer, activity *models.Activity) (*models.Activity, error) {

	activity, err := store.ActivityCreate(np, activity)
	if err != nil {
		return nil, err
	}

	//TODO: create all notifications for all relevant users, either as
	//   a. part of this function
	//   b. db trigger
	//   c. another transaction?
	_, err = UserNotificationCreate(ctx, store, activity, activity.CreatedBy) //TODO: create notification for everyone, not just like this
	if err != nil {
		return nil, err
	}

	return activity, nil

}
