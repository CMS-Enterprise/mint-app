package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
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
	// the activity this notification is in regards to
	activity *models.Activity,
	// The id of the user the notification is for
	userID uuid.UUID,
) (*models.UserNotification, error) {
	notif := models.NewUserNotification(activity.ActorID, activity.ID)
	notif.UserID = userID

	return store.UserNotificationCreate(store, notif)

}
