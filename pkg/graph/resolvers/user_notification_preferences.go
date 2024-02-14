package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// UserNotificationPreferencesGetByUserID returns a user notification preferences object based on a userID
func UserNotificationPreferencesGetByUserID(_ context.Context, np sqlutils.NamedPreparer, userID uuid.UUID) (*models.UserNotificationPreferences, error) {
	return storage.UserNotificationPreferencesGetByUserID(np, userID)
	//TODO: EASI-3925 convert this to a dataloader
}
