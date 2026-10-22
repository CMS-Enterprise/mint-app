package resolvers

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/logging"
	"github.com/cms-enterprise/mint-app/pkg/oktaapi"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// UpdateUserAccountFromOkta fetches the latest user info from Okta and persists it in our local UserAccount.
// This lives in resolvers to keep worker job code focused on Faktory concerns (args/queueing) rather than domain logic.
func UpdateUserAccountFromOkta[T logging.ChainableErrorOrWarnLogger[T]](
	ctx context.Context,
	store *storage.Store,
	oktaClient oktaapi.Client,
	logger T,
	username string,
) error {
	userInfo, err := oktaClient.FetchUserInfo(ctx, username)
	if err != nil {
		logger.ErrorOrWarn("failed to fetch user info from okta", zap.Error(err))
		return err
	}

	existingUser, err := storage.UserAccountGetByUsername(store, username)
	if err != nil {
		logger.ErrorOrWarn("failed to get user account by username", zap.Error(err))
		return err
	}
	if existingUser == nil {
		logger.ErrorOrWarn("user account not found for username")
		return fmt.Errorf("user account not found for username")
	}

	logger = logger.With(logfields.UserID(existingUser.ID))

	// Okta can return a blank value for a profile field (e.g. displayName is not
	// required by Okta's schema). user_account columns reject empty strings, so
	// an overwrite with "" would fail the update entirely; keep the existing
	// value instead.
	if userInfo.DisplayName != "" {
		existingUser.CommonName = userInfo.DisplayName
	}
	if userInfo.Email != "" {
		existingUser.Email = userInfo.Email
	}
	if userInfo.FirstName != "" {
		existingUser.GivenName = userInfo.FirstName
	}
	if userInfo.LastName != "" {
		existingUser.FamilyName = userInfo.LastName
	}

	_, err = storage.UserAccountUpdateByUserName(store, existingUser)
	if err != nil {
		logger.ErrorOrWarn("failed to update user account", zap.Error(err))
		return err
	}

	logger.Info("user account updated successfully")
	return nil
}
