package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// UserNotificationCollectionGetByUserID returns all Notifications for a user for a given User Account
func (s *Store) UserNotificationCollectionGetByUserID(np NamedPreparer, userAccountID uuid.UUID) ([]*models.UserNotification, error) {

	arg := map[string]interface{}{"user_id": userAccountID}

	notifCollection, procErr := sqlutils.SelectProcedure[models.UserNotification](np, sqlqueries.UserNotification.CollectionGetByUserID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting notification collection by userID (%s)  : %w", userAccountID, procErr)
	}
	return notifCollection, nil
}

// UserNotificationCreate a notification record in the database
func (s *Store) UserNotificationCreate(np NamedPreparer, notification *models.UserNotification) (*models.UserNotification, error) {

	if notification.ID == uuid.Nil {
		notification.ID = uuid.New()
	}
	retNotif, procErr := sqlutils.GetProcedure[models.UserNotification](np, sqlqueries.UserNotification.Create, notification)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new notification: %w", procErr)
	}
	return retNotif, nil
}

// UserNotificationMarkRead marks a notification record in the database as read. It will only allow the user who owns the notification to mark it as read,
// otherwise it won't update it (as the WHERE condition won't match)
func (s *Store) UserNotificationMarkRead(
	np NamedPreparer,
	// the id of the notification
	notificationID uuid.UUID,
	// the uuid of the user account that owns the notification
	userAccountID uuid.UUID) (*models.UserNotification, error) {

	arg := map[string]interface{}{
		"id":          notificationID,
		"modified_by": userAccountID,
	}

	retNotif, procErr := sqlutils.GetProcedure[models.UserNotification](np, sqlqueries.UserNotification.MarksAsReadByID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue marking notification as read: %w", procErr)
	}
	return retNotif, nil
}

// UserNotificationMarkAllAsRead marks all UNREAD notification records for a specific user in the database as read.
func (s *Store) UserNotificationMarkAllAsRead(
	np NamedPreparer,

	// the uuid of the user account that owns the notification
	userAccountID uuid.UUID) ([]*models.UserNotification, error) {

	arg := map[string]interface{}{"modified_by": userAccountID}

	notifCollection, procErr := sqlutils.SelectProcedure[models.UserNotification](np, sqlqueries.UserNotification.MarkCollectionAsReadByUserID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue marking notification collection as read by userID (%s)  : %w", userAccountID, procErr)
	}
	return notifCollection, nil
}
