package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UserNotificationPreferencesGetByUserID returns a user notification preferences object based on a userID
func UserNotificationPreferencesGetByUserID(_ context.Context, np sqlutils.NamedPreparer, userID uuid.UUID) (*models.UserNotificationPreferences, error) {
	return storage.UserNotificationPreferencesGetByUserID(np, userID)
	//TODO: EASI-3925 convert this to a dataloader
}

// UserNotificationPreferencesUpdate updates a user notification preferences object for a user
func UserNotificationPreferencesUpdate(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, changes map[string]interface{}) (*models.UserNotificationPreferences, error) {
	// TODO: EASI-3925 update to take a named preparer instead of the store
	existingPreferences, err := UserNotificationPreferencesGetByUserID(ctx, store, principal.Account().ID)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingPreferences, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	return storage.UserNotificationPreferencesUpdate(store, existingPreferences)
	//TODO: EASI-3925 convert this to a dataloader
}
