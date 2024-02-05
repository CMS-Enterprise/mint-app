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

	arg := map[string]interface{}{"id": userAccountID}

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
