package userhelpers

import (
	"errors"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// GetOrCreateUserAccount will return an account if it exists, or create and return a new one if not
func GetOrCreateUserAccount(store *storage.Store, username string) (*authentication.UserAccount, error) {
	userAccount, accErr := store.UserAccountGetByEUAID(username)
	if accErr != nil {
		return nil, errors.New("failed to get user information from the database")
	}
	euaID := username
	//TODO, we need actual username and email here, and any other important information
	testName := "Test Name"
	testEmail := "test@test.com"

	if userAccount == nil {
		user := authentication.UserAccount{
			EuaID:      &euaID,
			CommonName: testName,
			Email:      testEmail,
		}
		_, err := store.UserAccountInsertByEUAID(&user)
		if err != nil {
			return nil, err
		}
	}
	return userAccount, nil
}
