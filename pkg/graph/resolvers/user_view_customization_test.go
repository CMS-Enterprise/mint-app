package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (suite *ResolverSuite) TestUserViewCustomizationGetByUserID() {
	uvc, err := UserViewCustomizationGetByUserID(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.NotNil(uvc)
}

func (suite *ResolverSuite) TestUserViewCustomizationUpdate() {
	uvc, err := UserViewCustomizationGetByUserID(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.NotNil(uvc)
	changes := map[string]interface{}{
		"viewCustomization": []string{string(models.ViewCustomizationTypeMyModelPlans)},
	}
	updatedUVC, err := UserViewCustomizationUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, changes)
	suite.NoError(err)
	suite.NotNil(updatedUVC)

	suite.EqualValues([]string{string(models.ViewCustomizationTypeMyModelPlans)}, updatedUVC.ViewCustomization)
}
