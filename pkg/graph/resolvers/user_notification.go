package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UserNotificationCollectionGetByUser gets all userNotifications for a given user account id from the database
func UserNotificationCollectionGetByUser(
	ctx context.Context,
	store *storage.Store,
	principal authentication.Principal,
) ([]*models.UserNotification, error) {

	//TODO: EASI-3294 do we want to make this resolver take a NamedPreparer? That way we can selectively create notifications as part of a transaction here
	return store.UserNotificationCollectionGetByUserID(store, principal.Account().ID)

}

// UserNotificationCreate creates a UserNotificationRecord in the database
func UserNotificationCreate(
	ctx context.Context,
	store *storage.Store,
	np sqlutils.NamedPreparer,
	// the activity this notification is in regards to
	activity *models.Activity,
	// The id of the user the notification is for
	userID uuid.UUID,
) (*models.UserNotification, error) {
	notif := models.NewUserNotification(activity.ActorID, activity.ID)
	notif.UserID = userID

	return store.UserNotificationCreate(np, notif)

}

// UserNotificationCreateAllPerActivity is a helper function that will create notifications based on the new activity that is being writen to the database.
func UserNotificationCreateAllPerActivity(ctx context.Context,
	store *storage.Store,
	np sqlutils.NamedPreparer,
	// the activity this notification is in regards to
	activity *models.Activity) ([]*models.UserNotification, error) {
	var notifications []*models.UserNotification

	originatorNotif, err := UserNotificationCreate(ctx, store, np, activity, activity.ActorID) //TODO: get the actual users who need a notification, create a list, or handle in DB
	if err != nil {
		return nil, err
	}
	notifications = append(notifications, originatorNotif)

	/* TODO: EASI-3294
	1. Find users to be notified base on the notification type
	2. Build a notification, create the notification


	*/
	return notifications, nil

}

// UserNotificationMarkAsRead marks a single notification as read in the database
func UserNotificationMarkAsRead(_ context.Context,
	store *storage.Store,
	np sqlutils.NamedPreparer,
	principal authentication.Principal,
	// the id of the notification
	notificationID uuid.UUID) (*models.UserNotification, error) {

	return store.UserNotificationMarkRead(np, notificationID, principal.Account().ID)

}

// UserNotificationMarkAllAsRead marks all notifications for a user as read in the database
func UserNotificationMarkAllAsRead(_ context.Context,
	store *storage.Store,
	np sqlutils.NamedPreparer,
	principal authentication.Principal) ([]*models.UserNotification, error) {

	return store.UserNotificationMarkAllAsRead(np, principal.Account().ID)

}
