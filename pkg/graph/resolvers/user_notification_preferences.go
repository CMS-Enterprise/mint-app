package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// UserNotificationPreferencesGetByUserID returns a user notification preferences object based on a userID
func UserNotificationPreferencesGetByUserID(ctx context.Context, userID uuid.UUID) (*models.UserNotificationPreferences, error) {
	return loaders.UserNotificationPreferencesGetByUserID(ctx, userID)
}

// UserNotificationPreferencesUpdate updates a user notification preferences object for a user
// Notice: The specific UserNotificationPreference is inferred from the principal object. It will only update the notification preference for the current user.
func UserNotificationPreferencesUpdate(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, changes map[string]interface{}) (*models.UserNotificationPreferences, error) {
	existingPreferences, err := UserNotificationPreferencesGetByUserID(ctx, principal.Account().ID)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingPreferences, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	return storage.UserNotificationPreferencesUpdate(store, existingPreferences)
}
