package resolvers

// IsPlanFavorited checks if a model plan is a favorite.
func (suite *ResolverSuite) TestIsPlanFavorited() {

	plan := suite.createModelPlan("My Favorite Plan")

	_, err := PlanFavoriteCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)

	suite.NoError(err)

	favorited, err := IsPlanFavorited(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(favorited, true)

}

// PlanFavoriteCreate creates a new plan favorite record in the database
func (suite *ResolverSuite) TestPlanFavoriteCreate() {

	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)

	suite.NoError(err)
	suite.EqualValues(favorite.ModelPlanID, plan.ID)
	// suite.EqualValues(favorite.UserID, plan.CreatedBy) //TODO can renable after all tables are migrated
	suite.EqualValues(favorite.UserID, suite.testConfigs.Principal.Account().ID)

}

// PlanFavoriteDelete deletes a plan favorite record in the database
func (suite *ResolverSuite) TestPlanFavoriteDelete() {

	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)

	suite.NoError(err)

	del, err := PlanFavoriteDelete(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, favorite.ModelPlanID)
	suite.NoError(err)
	suite.EqualValues(del.ID, favorite.ID)

}

// PlanFavoriteGet returns a plan favorite record
func (suite *ResolverSuite) TestPlanFavoriteGet() {

	plan := suite.createModelPlan("My Favorite Plan")

	favorite, err := PlanFavoriteCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)
	suite.NoError(err)

	retFav, err := PlanFavoriteGet(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, favorite.ModelPlanID)
	suite.NoError(err)
	suite.EqualValues(retFav.ID, favorite.ID)

}
