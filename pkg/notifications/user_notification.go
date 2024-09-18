package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// UserNotificationCollectionGetByUser gets all userNotifications for a given user account id from the database
func UserNotificationCollectionGetByUser(
	_ context.Context,
	np sqlutils.NamedPreparer,
	principal authentication.Principal,
) (*models.UserNotifications, error) {

	notifications, err := dbStore.notification.CollectionGetByUserID(np, principal.Account().ID)
	if err != nil {
		return nil, err
	}
	return &models.UserNotifications{
		Notifications: notifications,
	}, nil

}

// userNotificationCreate creates a UserNotificationRecord in the database
func userNotificationCreate(
	_ context.Context,
	np sqlutils.NamedPreparer,
	// the activity this notification is in regards to
	activity *models.Activity,
	// The id of the user the notification is for
	userID uuid.UUID,
	// the preference of a user about specific notification types
	notificationPreference models.UserNotificationPreferenceFlags,

) (*models.UserNotification, error) {

	notif := models.NewUserNotification(activity.ActorID, activity.ID, notificationPreference.InApp(), notificationPreference.SendEmail())
	notif.UserID = userID

	return dbStore.notification.Create(np, notif)

}

// UserNotificationMarkAsRead marks a single notification as read in the database
func UserNotificationMarkAsRead(
	_ context.Context,
	np sqlutils.NamedPreparer,
	principal authentication.Principal,
	// the id of the notification
	notificationID uuid.UUID) (*models.UserNotification, error) {

	return dbStore.notification.MarkRead(np, notificationID, principal.Account().ID)

}

// UserNotificationMarkAllAsRead marks all notifications for a user as read in the database
func UserNotificationMarkAllAsRead(
	_ context.Context,
	np sqlutils.NamedPreparer,
	principal authentication.Principal) ([]*models.UserNotification, error) {

	return dbStore.notification.MarkAllAsRead(np, principal.Account().ID)

}
