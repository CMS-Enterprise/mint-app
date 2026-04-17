package resolvers

import (
	"context"
	"errors"

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
		return errors.New("user account not found for username")
	}

	logger = logger.With(logfields.UserID(existingUser.ID))

	existingUser.CommonName = userInfo.DisplayName
	existingUser.Email = userInfo.Email
	existingUser.GivenName = userInfo.FirstName
	existingUser.FamilyName = userInfo.LastName

	_, err = storage.UserAccountUpdateByUserName(store, existingUser)
	if err != nil {
		logger.ErrorOrWarn("failed to update user account", zap.Error(err))
		return err
	}

	logger.Info("user account updated successfully")
	return nil
}
