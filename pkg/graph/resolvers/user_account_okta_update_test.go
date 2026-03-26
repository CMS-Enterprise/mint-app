package resolvers

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/cms-enterprise/mint-app/pkg/logging"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/oktaapi"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

type fakeOktaClient struct {
	userInfo *models.UserInfo
}

func (f fakeOktaClient) FetchUserInfo(_ context.Context, _ string) (*models.UserInfo, error) {
	return f.userInfo, nil
}

func (f fakeOktaClient) SearchByName(_ context.Context, _ string) ([]*models.UserInfo, error) {
	return nil, nil
}

var _ oktaapi.Client = (*fakeOktaClient)(nil)

func TestUpdateUserAccountFromOkta_Success(t *testing.T) {
	ctx := context.Background()

	dbConfig, ldClient, logger, _, _ := getTestDependencies()
	store, err := storage.NewStore(dbConfig, ldClient)
	require.NoError(t, err)
	require.NoError(t, store.TruncateAllTablesDANGEROUS(logger))

	username := "TEST"

	// Create the existing account first.
	getUserInfo := func(ctx context.Context, _ string) (*models.UserInfo, error) {
		return &models.UserInfo{
			DisplayName: "Initial Test User",
			Email:       "initial@test.com",
			FirstName:   "Initial",
			LastName:    "User",
			Username:    username,
		}, nil
	}
	_, err = userhelpers.GetOrCreateUserAccount(
		ctx,
		store,
		store,
		username,
		true,  // hasLoggedIn
		false, // isMacUser
		userhelpers.GetUserInfoAccountInfoWrapperFunc(getUserInfo),
	)
	require.NoError(t, err)

	fakeOkta := fakeOktaClient{
		userInfo: &models.UserInfo{
			DisplayName: "Updated Test User",
			Email:       "updated@test.com",
			FirstName:   "Updated",
			LastName:    "User",
			Username:    username,
		},
	}

	resLogger := logging.NewZapLogger(logger)
	err = UpdateUserAccountFromOkta(ctx, store, fakeOkta, resLogger, username)
	require.NoError(t, err)

	updated, err := storage.UserAccountGetByUsername(store, username)
	require.NoError(t, err)
	require.NotNil(t, updated)

	require.Equal(t, "Updated Test User", updated.CommonName)
	require.Equal(t, "updated@test.com", updated.Email)
	require.Equal(t, "Updated", updated.GivenName)
	require.Equal(t, "User", updated.FamilyName)
}

func TestUpdateUserAccountFromOkta_UserAccountMissing(t *testing.T) {
	ctx := context.Background()

	dbConfig, ldClient, logger, _, _ := getTestDependencies()
	store, err := storage.NewStore(dbConfig, ldClient)
	require.NoError(t, err)
	require.NoError(t, store.TruncateAllTablesDANGEROUS(logger))

	fakeOkta := fakeOktaClient{
		userInfo: &models.UserInfo{
			DisplayName: "Does Not Matter",
			Email:       "doesnotmatter@test.com",
			FirstName:   "Nope",
			LastName:    "User",
		},
	}

	resLogger := logging.NewZapLogger(logger)
	err = UpdateUserAccountFromOkta(ctx, store, fakeOkta, resLogger, "MISSING_USER_ACCOUNT")
	require.Error(t, err)
}
