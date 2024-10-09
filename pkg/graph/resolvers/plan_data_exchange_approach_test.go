package resolvers

func (suite *ResolverSuite) TestPlanDataExchangeApproachGetByID() {
	plan1 := suite.createModelPlan("model plan 1")
	approach, err := PlanDataExchangeApproachGetByModelPlanID(suite.testConfigs.Logger, suite.testConfigs.Store, plan1.ID)
	suite.NoError(err)
	suite.NotNil(approach)

	// Assert that the correct approach was returned
	suite.EqualValues(plan1.ID, approach.ModelPlanID)

	retApproach, err := PlanDataExchangeApproachGetByID(suite.testConfigs.Logger, suite.testConfigs.Store, approach.ID)

	suite.NoError(err)
	suite.NotNil(retApproach)

	suite.EqualValues(approach.ID, retApproach.ID)

}
