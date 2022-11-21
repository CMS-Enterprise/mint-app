package userhelpers

import (
	"errors"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// GetOrCreateUserAccount will return an account if it exists, or create and return a new one if not
func GetOrCreateUserAccount(store *storage.Store, princ authentication.Principal) (*models.UserAccount, error) {
	userAccount, accErr := store.UserAccountGetByEUAID(princ.ID())
	if accErr != nil {
		return nil, errors.New("failed to get user information from the database")
	}
	euaID := princ.ID()
	testName := "Test Name"
	testEmail := "test@test.com"

	if userAccount == nil {
		user := models.UserAccount{
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
