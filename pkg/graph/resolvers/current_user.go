package resolvers

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/notifications"
	"github.com/cmsgov/mint-app/pkg/storage"

	ldclient "github.com/launchdarkly/go-server-sdk/v6"
)

// CurrentUserLaunchDarklySettingsGet returns the launch darkly settings for the current user
func CurrentUserLaunchDarklySettingsGet(ctx context.Context, ldClient *ldclient.LDClient) (*model.LaunchDarklySettings, error) {
	ldContext := flags.Principal(ctx)
	userKey := ldContext.Key()
	signedHash := ldClient.SecureModeHash(ldContext)

	LaunchDarkly := model.LaunchDarklySettings{
		UserKey:    userKey,
		SignedHash: signedHash,
	}

	return &LaunchDarkly, nil
}

// CurrentUserAccountGet Gets the account of the current user in the database
func CurrentUserAccountGet(ctx context.Context) (*authentication.UserAccount, error) {
	princ := appcontext.Principal(ctx)
	return princ.Account(), nil
}

// CurrentUserNotificationsGet returns the notifications for the Current User
func CurrentUserNotificationsGet(ctx context.Context, store *storage.Store) (*models.UserNotifications, error) {
	princ := appcontext.Principal(ctx)
	return notifications.UserNotificationCollectionGetByUser(ctx, store, princ)
}
