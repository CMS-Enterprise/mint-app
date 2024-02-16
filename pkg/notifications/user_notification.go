package notifications

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
) (*UserNotifications, error) {

	//TODO: EASI-3294 do we want to make this resolver take a NamedPreparer? That way we can selectively create notifications as part of a transaction here
	notifications, err := dbCall.UserNotificationCollectionGetByUserID(store, principal.Account().ID)
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
	np sqlutils.NamedPreparer,
	// the activity this notification is in regards to
	activity *Activity,
	// The id of the user the notification is for
	userID uuid.UUID,
	// the preference of a user about specific notification types
	notificationPreference models.UserNotificationPreferenceFlag,

) (*UserNotification, error) {

	notif := NewUserNotification(activity.ActorID, activity.ID, notificationPreference.InApp(), notificationPreference.SendEmail())
	notif.UserID = userID

	return dbCall.UserNotificationCreate(np, notif)

}

// // userNotificationCreateAllPerActivity is a helper function that will create notifications based on the new activity that is being writen to the database.
// func userNotificationCreateAllPerActivity(ctx context.Context,
// 	np sqlutils.NamedPreparer,
// 	// the activity this notification is in regards to
// 	activity *Activity) ([]*UserNotification, error) {
// 	var notifications []*UserNotification

// 	switch activity.ActivityType {
// 	case ActivityDigest:
// 		fmt.Println("Handling DAILY_DIGEST_COMPLETE activity")
// 	case ActivityAddedAsCollaborator:
// 		fmt.Println("Handling ADDED_AS_COLLABORATOR activity")
// 	case ActivityTaggedInDiscussion:
// 		fmt.Println("Handling TAGGED_IN_DISCUSSION activity")
// 	case ActivityTaggedInDiscussionReply:
// 		fmt.Println("Handling TAGGED_IN_DISCUSSION_REPLY activity")
// 	case ActivityNewDiscussionReply:
// 		fmt.Println("Handling NEW_DISCUSSION_REPLY activity")
// 	case ActivityModelPlanShared:
// 		fmt.Println("Handling MODEL_PLAN_SHARED activity")
// 	case ActivityNewPlanDiscussion:
// 		fmt.Println("Handling NEW_PLAN_DISCUSSION activity")
// 	default:
// 		return nil, fmt.Errorf("unknown activity type, unable to create notifications")
// 	}

// 	//TODO: EASI-3925 update this to switch on Activities
// 	originatorNotif, err := userNotificationCreate(ctx, np, activity, activity.ActorID) //TODO: get the actual users who need a notification, create a list, or handle in DB
// 	if err != nil {
// 		return nil, err
// 	}
// 	notifications = append(notifications, originatorNotif)

// 	/* TODO: EASI-3294
// 	1. Find users to be notified base on the notification type
// 	2. Build a notification, create the notification

// 	*/
// 	return notifications, nil

// }

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
