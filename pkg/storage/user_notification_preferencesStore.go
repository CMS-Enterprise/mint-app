package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// UserNotificationPreferencesCreate creates a new UserNotificationPreferences in the database
func UserNotificationPreferencesCreate(np sqlutils.NamedPreparer, userNotificationPreferences *models.UserNotificationPreferences) (*models.UserNotificationPreferences, error) {
	if userNotificationPreferences.ID == uuid.Nil {
		userNotificationPreferences.ID = uuid.New()
	}

	retUserNotificationPref, procErr := sqlutils.GetProcedure[models.UserNotificationPreferences](np, sqlqueries.UserNotificationPreferences.Create, userNotificationPreferences)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new UserNotificationPreferences object: %w", procErr)
	}
	return retUserNotificationPref, nil
}

// UserNotificationPreferencesGetByUserID returns a  UserNotificationPreferences  object for a given user_id in the database
func UserNotificationPreferencesGetByUserID(np sqlutils.NamedPreparer, userID uuid.UUID) (*models.UserNotificationPreferences, error) {

	//TODO: EASI-3925 this should be a dataloader
	arg := map[string]interface{}{
		"user_id": userID,
	}

	retUserNotificationPref, procErr := sqlutils.GetProcedure[models.UserNotificationPreferences](np, sqlqueries.UserNotificationPreferences.GetByUserID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue returning  UserNotificationPreferences object by userID: %w", procErr)
	}
	return retUserNotificationPref, nil
}

// UserNotificationPreferencesUpdate updates a new UserNotificationPreferences in the database
func UserNotificationPreferencesUpdate(np sqlutils.NamedPreparer, userNotificationPreferences *models.UserNotificationPreferences) (*models.UserNotificationPreferences, error) {

	retUserNotificationPref, procErr := sqlutils.GetProcedure[models.UserNotificationPreferences](np, sqlqueries.UserNotificationPreferences.Update, userNotificationPreferences)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating UserNotificationPreferences object: %w", procErr)
	}
	return retUserNotificationPref, nil
}
