package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
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
// Note this should only be used for cases when a data loader is not possible to use directly.
func UserNotificationPreferencesGetByUserID(np sqlutils.NamedPreparer, userID uuid.UUID) (*models.UserNotificationPreferences, error) {
	arg := map[string]interface{}{
		"user_id": userID,
	}

	retUserNotificationPref, procErr := sqlutils.GetProcedure[models.UserNotificationPreferences](np, sqlqueries.UserNotificationPreferences.GetByUserID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue returning  UserNotificationPreferences object by userID: %w", procErr)
	}
	return retUserNotificationPref, nil
}

// UserNotificationPreferencesGetByUserIDLoader returns a  collection of UserNotificationPreferences  object for a given collection of user_ids, serialized in json
func UserNotificationPreferencesGetByUserIDLoader(np sqlutils.NamedPreparer, paramTableJSON string) ([]*models.UserNotificationPreferences, error) {
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	retNotificationPreferences, err := sqlutils.SelectProcedure[models.UserNotificationPreferences](np, sqlqueries.UserNotificationPreferences.GetByUserIDLoader, arg)
	if err != nil {
		return nil, fmt.Errorf("issue selecting notification preferences by user_id with the data loader, %w", err)
	}

	return retNotificationPreferences, nil
}

// UserNotificationPreferencesUpdate updates a new UserNotificationPreferences in the database
func UserNotificationPreferencesUpdate(np sqlutils.NamedPreparer, userNotificationPreferences *models.UserNotificationPreferences) (*models.UserNotificationPreferences, error) {
	retUserNotificationPref, procErr := sqlutils.GetProcedure[models.UserNotificationPreferences](np, sqlqueries.UserNotificationPreferences.Update, userNotificationPreferences)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating UserNotificationPreferences object: %w", procErr)
	}
	return retUserNotificationPref, nil
}
