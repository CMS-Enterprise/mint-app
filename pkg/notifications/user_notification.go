package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UserNotificationCollectionGetByUser gets all userNotifications for a given user account id from the database
func UserNotificationCollectionGetByUser(
	ctx context.Context,
	store *storage.Store,
	principal authentication.Principal,
) (*UserNotifications, error) {
	var db dataBaseCalls

	//TODO: EASI-3294 do we want to make this resolver take a NamedPreparer? That way we can selectively create notifications as part of a transaction here
	notifications, err := db.UserNotificationCollectionGetByUserID(store, principal.Account().ID)
	if err != nil {
		return nil, err
	}
	return &UserNotifications{
		Notifications: notifications,
	}, nil

}

// userNotificationCreate creates a UserNotificationRecord in the database
func userNotificationCreate(
	ctx context.Context,
	store *storage.Store,
	np sqlutils.NamedPreparer,
	// the activity this notification is in regards to
	activity *Activity,
	// The id of the user the notification is for
	userID uuid.UUID,
) (*UserNotification, error) {
	notif := NewUserNotification(activity.ActorID, activity.ID)
	notif.UserID = userID

	var db dataBaseCalls
	return db.UserNotificationCreate(np, notif)

}

// userNotificationCreateAllPerActivity is a helper function that will create notifications based on the new activity that is being writen to the database.
func userNotificationCreateAllPerActivity(ctx context.Context,
	store *storage.Store,
	np sqlutils.NamedPreparer,
	// the activity this notification is in regards to
	activity *Activity) ([]*UserNotification, error) {
	var notifications []*UserNotification

	originatorNotif, err := userNotificationCreate(ctx, store, np, activity, activity.ActorID) //TODO: get the actual users who need a notification, create a list, or handle in DB
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
	notificationID uuid.UUID) (*UserNotification, error) {

	return dbCall.UserNotificationMarkRead(np, notificationID, principal.Account().ID)

}

// UserNotificationMarkAllAsRead marks all notifications for a user as read in the database
func UserNotificationMarkAllAsRead(_ context.Context,
	store *storage.Store,
	np sqlutils.NamedPreparer,
	principal authentication.Principal) ([]*UserNotification, error) {

	return dbCall.UserNotificationMarkAllAsRead(np, principal.Account().ID)

}
