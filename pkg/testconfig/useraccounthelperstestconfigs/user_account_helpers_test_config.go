// Package useraccounthelperstestconfigs provides utility functions for getting user accounts using the user helper package
package useraccounthelperstestconfigs

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

// GetTestPrincipal is a utility function to return a principal for tests
func GetTestPrincipal(store *storage.Store, userName string) *authentication.ApplicationPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(context.Background(), store, store, userName, true, false, userhelpers.GetOktaAccountInfoWrapperFunction(userhelpers.GetUserInfoFromOktaLocal))

	princ := &authentication.ApplicationPrincipal{
		Username:          userName,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
		JobCodeMAC:        false,
		JobCodeNonCMS:     false,
		UserAccount:       userAccount,
	}
	return princ

}
