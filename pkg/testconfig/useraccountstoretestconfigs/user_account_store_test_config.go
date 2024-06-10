// Package useraccountstoretestconfigs provides utility functions for getting user accounts using the storage package
package useraccountstoretestconfigs

import (
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// GetTestPrincipal either inserts a new user account record into the database, or returns the record already in the database
// the common name of the inserted account is the username for simplicity
func GetTestPrincipal(store *storage.Store, userName string) (*authentication.ApplicationPrincipal, error) {
	userAccount, accErr := storage.UserAccountGetByUsername(store, userName)
	if accErr != nil {
		return nil, accErr
	}
	if userAccount != nil {
		return &authentication.ApplicationPrincipal{
			Username:          *userAccount.Username,
			JobCodeUSER:       true,
			JobCodeASSESSMENT: true,
			JobCodeMAC:        false,
			JobCodeNonCMS:     false,
			UserAccount:       userAccount,
		}, nil
	}
	// we mock a user account to the DB directly here
	userAccount = &authentication.UserAccount{
		Username:    models.StringPointer(userName),
		IsEUAID:     true,
		CommonName:  userName,
		Locale:      "testTestTest",
		Email:       "testTestTest",
		GivenName:   "testTestTest",
		FamilyName:  "testTestTest",
		ZoneInfo:    "testTestTest",
		HasLoggedIn: true,
	}

	newAccount, newErr := sqlutils.WithTransaction[authentication.UserAccount](store, func(tx *sqlx.Tx) (*authentication.UserAccount, error) {
		newAccount, newErr := storage.UserAccountInsertByUsername(tx, userAccount)
		if newErr != nil {
			return nil, newErr
		}
		pref := models.NewUserNotificationPreferences(newAccount.ID)

		_, preferencesErr := storage.UserNotificationPreferencesCreate(tx, pref)
		if preferencesErr != nil {
			return nil, preferencesErr
		}
		return newAccount, nil

	})
	if newErr != nil {
		return nil, newErr
	}

	princ := &authentication.ApplicationPrincipal{
		Username:          *newAccount.Username,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
		JobCodeMAC:        false,
		JobCodeNonCMS:     false,
		UserAccount:       newAccount,
	}
	return princ, nil

}
