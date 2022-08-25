package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/authentication"
)

//PlanFavoriteCollection returns a list of favorites
func (suite *ResolverSuite) TestPlanFavoriteCollection() {
	princ := &authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.UserInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}
	plan := suite.createModelPlan("My Favorite Plan")

	_, err := PlanFavoriteCreate(suite.testConfigs.Logger, princ, suite.testConfigs.Store, plan.ID)

	suite.NoError(err)
	favCol, err := PlanFavoriteCollection(suite.testConfigs.Logger, princ, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(favCol, 1)
}

//IsPlanFavorited checks if a model plan is a favorite.
func (suite *ResolverSuite) TestIsPlanFavorited() {

	princ := &authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.UserInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}
	plan := suite.createModelPlan("My Favorite Plan")

	_, err := PlanFavoriteCreate(suite.testConfigs.Logger, princ, suite.testConfigs.Store, plan.ID)

	suite.NoError(err)

	favorited, err := IsPlanFavorited(suite.testConfigs.Logger, princ, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(favorited, true)

}

//PlanFavoriteCreate creates a new plan favorite record in the database
func (suite *ResolverSuite) TestPlanFavoriteCreate() {

	princ := &authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.UserInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}
	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(suite.testConfigs.Logger, princ, suite.testConfigs.Store, plan.ID)

	suite.NoError(err)
	suite.EqualValues(favorite.ModelPlanID, plan.ID)
	suite.EqualValues(favorite.UserID, plan.CreatedBy)

}

//PlanFavoriteDelete deletes a plan favorite record in the database
func (suite *ResolverSuite) TestPlanFavoriteDelete() {

	princ := &authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.UserInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}
	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(suite.testConfigs.Logger, princ, suite.testConfigs.Store, plan.ID)

	suite.NoError(err)

	del, err := PlanFavoriteDelete(suite.testConfigs.Logger, princ, suite.testConfigs.Store, favorite.ModelPlanID)
	suite.NoError(err)
	suite.EqualValues(del.ID, favorite.ID)

}

//PlanFavoriteGet returns a plan favorite record
func (suite *ResolverSuite) TestPlanFavoriteGet() {
	princ := &authentication.EUAPrincipal{
		EUAID:             suite.testConfigs.UserInfo.EuaUserID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	}
	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(suite.testConfigs.Logger, princ, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)

	retFav, err := PlanFavoriteGet(suite.testConfigs.Logger, princ, suite.testConfigs.Store, favorite.ModelPlanID)
	suite.NoError(err)
	suite.EqualValues(retFav.ID, favorite.ID)

}
