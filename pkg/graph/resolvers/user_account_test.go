package resolvers

import (
	"context"
	"fmt"

	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// UserAccountGetByUsername returns a user account by it's EUAID
func (suite *ResolverSuite) TestUserAccountGetByUsername() {
	username := "USER NUMBER 1"

	princ1 := suite.GetTestPrincipal(suite.testConfigs.Store, username)

	account, err := UserAccountGetByUsername(suite.testConfigs.Logger, suite.testConfigs.Store, username)
	suite.NoError(err)
	suite.EqualValues(princ1.UserAccount.CommonName, account.CommonName)
	suite.EqualValues(princ1.UserAccount.Email, account.Email)

}

// UserAccountGetByIDLOADER returns a user account by it's internal ID, utilizing a data loader
func (suite *ResolverSuite) TestUserAccountGetByIDLOADER() {
	princ1 := suite.GetTestPrincipal(suite.testConfigs.Store, "USER NUMBER 1")
	princ2 := suite.GetTestPrincipal(suite.testConfigs.Store, "USER NUMBER 2")
	princ3 := suite.GetTestPrincipal(suite.testConfigs.Store, "TEST")
	princ4 := suite.GetTestPrincipal(suite.testConfigs.Store, "COLB")
	princ5 := suite.GetTestPrincipal(suite.testConfigs.Store, "BTMN")

	princArray := []*authentication.ApplicationPrincipal{princ1, princ2, princ3, princ4, princ5}

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)

	for _, princ := range princArray {
		theFunc := getUserAccountLoaderVerificationFunction(ctx, princ, verifyUserAccountLoader)
		g.Go(theFunc)
	}
	err := g.Wait()
	suite.NoError(err)

}

func verifyUserAccountLoader(ctx context.Context, princ *authentication.ApplicationPrincipal) error {

	retAccount, err := UserAccountGetByIDLOADER(ctx, princ.UserAccount.ID)
	if err != nil {
		return err
	}
	if retAccount.CommonName != princ.UserAccount.CommonName {
		return fmt.Errorf("name from DB (%s) loader doesn't match expected (%s)", retAccount.CommonName, princ.Account().CommonName)
	}
	return nil

}

func getUserAccountLoaderVerificationFunction(ctx context.Context, princ *authentication.ApplicationPrincipal, verifyAccountFunc func(ctx context.Context, princ *authentication.ApplicationPrincipal) error) func() error {
	return func() error {
		return verifyUserAccountLoader(ctx, princ)
	}
}
