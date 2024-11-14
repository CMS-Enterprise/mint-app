package resolvers

func (suite *ResolverSuite) TestMTOToggleReadyForReview() {
	plan := suite.createModelPlan("plan for testing MTO mark ready for review")

	markedReadyPrinc := suite.getTestPrincipal(suite.testConfigs.Store, "tester")

	// don't set it
	mto1, err := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, false)
	suite.NoError(err)
	if suite.NotNil(mto1, "mto shouldn't be nil") {
		suite.Nil(mto1.ModelPlan.MTOReadyForReviewBy)
		suite.Nil(mto1.ModelPlan.MTOReadyForReviewDts)
	}

	// mark ready for review by the tester
	mto2, err2 := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		markedReadyPrinc, suite.testConfigs.Store, plan.ID, true)
	suite.NoError(err2)
	if suite.NotNil(mto2, "mto shouldn't be nil") {
		if suite.NotNil(mto2.ModelPlan.MTOReadyForReviewBy) {
			suite.EqualValues(markedReadyPrinc.UserAccount.ID, *mto2.ModelPlan.MTOReadyForReviewBy,
				"the mto should have been marked ready for review by the tester principal")
		}
		suite.NotNil(mto2.ModelPlan.MTOReadyForReviewDts)
	}

	// try to mark ready for review by the default principal
	mto3, err3 := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		markedReadyPrinc, suite.testConfigs.Store, plan.ID, true)
	suite.NoError(err3)
	if suite.NotNil(mto3, "mto shouldn't be nil") {
		if suite.NotNil(mto3.ModelPlan.MTOReadyForReviewBy) {
			suite.EqualValues(markedReadyPrinc.UserAccount.ID, *mto3.ModelPlan.MTOReadyForReviewBy,
				"the mto should have been marked ready for review by the tester principal")
		}
		suite.NotNil(mto3.ModelPlan.MTOReadyForReviewDts)
	}

	// try to mark not ready for review by the default principal
	mto4, err4 := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		markedReadyPrinc, suite.testConfigs.Store, plan.ID, false)
	suite.NoError(err4)
	if suite.NotNil(mto4, "mto shouldn't be nil") {
		suite.Nil(mto4.ModelPlan.MTOReadyForReviewBy)
		suite.Nil(mto4.ModelPlan.MTOReadyForReviewDts)
	}

	// try to mark ready for review by the default principal
	mto5, err5 := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		markedReadyPrinc, suite.testConfigs.Store, plan.ID, true)
	suite.NoError(err5)
	if suite.NotNil(mto5, "mto shouldn't be nil") {
		if suite.NotNil(mto5.ModelPlan.MTOReadyForReviewBy) {
			suite.EqualValues(markedReadyPrinc.UserAccount.ID, *mto5.ModelPlan.MTOReadyForReviewBy,
				"the mto should have been marked ready for review by the default principal")
		}
		suite.NotNil(mto5.ModelPlan.MTOReadyForReviewDts)
	}
}
