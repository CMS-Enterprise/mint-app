package resolvers

import "github.com/cms-enterprise/mint-app/pkg/models"

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

func (suite *ResolverSuite) TestPlanDataExchangeApproachGetByModelPlanID() {
	plan1 := suite.createModelPlan("model plan 1")
	approach, err := PlanDataExchangeApproachGetByModelPlanID(suite.testConfigs.Logger, suite.testConfigs.Store, plan1.ID)
	suite.NoError(err)
	suite.NotNil(approach)

	// Assert that the correct approach was returned
	suite.EqualValues(plan1.ID, approach.ModelPlanID)
}

func (suite *ResolverSuite) TestPlanDataExchangeApproachUpdate() {

	plan1 := suite.createModelPlan("model plan 1")
	approach, err := PlanDataExchangeApproachGetByModelPlanID(suite.testConfigs.Logger, suite.testConfigs.Store, plan1.ID)
	suite.NoError(err)
	suite.NotNil(approach)

	suite.Nil(approach.DataToCollectFromParticipants)
	suite.Nil(approach.DataToCollectFromParticipantsReportsDetails)
	suite.Nil(approach.DataToCollectFromParticipantsOther)
	suite.Nil(approach.DataWillNotBeCollectedFromParticipants)
	suite.Nil(approach.DataToCollectFromParticipantsNote)
	suite.Nil(approach.DataToSendToParticipants)
	suite.Nil(approach.DataToSendToParticipantsNote)
	suite.Nil(approach.DoesNeedToMakeMultiPayerDataAvailable)
	suite.Nil(approach.AnticipatedMultiPayerDataAvailabilityUseCase)
	suite.Nil(approach.DoesNeedToMakeMultiPayerDataAvailableNote)
	suite.Nil(approach.DoesNeedToCollectAndAggregateMultiSourceData)
	suite.Nil(approach.MultiSourceDataToCollect)
	suite.Nil(approach.MultiSourceDataToCollectOther)
	suite.Nil(approach.DoesNeedToCollectAndAggregateMultiSourceDataNote)
	suite.Nil(approach.WillImplementNewDataExchangeMethods)
	suite.Nil(approach.NewDataExchangeMethodsDescription)
	suite.Nil(approach.NewDataExchangeMethodsNote)
	suite.Nil(approach.AdditionalDataExchangeConsiderationsDescription)
	suite.Nil(approach.ModifiedBy)
	suite.Nil(approach.ModifiedDts)

	suite.NotNil(approach.Status)
	suite.NotNil(approach.CreatedBy)
	suite.NotNil(approach.CreatedDts)

	// Assert that the correct approach was returned
	suite.EqualValues(plan1.ID, approach.ModelPlanID)

	multipayerAvailableExpected := models.YesNoTypeYes
	doesNeedToMakeMultiPayerDataAvailableNoteExpected := "yes yes yes, make available"

	changes := map[string]interface{}{
		"doesNeedToMakeMultiPayerDataAvailable":     multipayerAvailableExpected,
		"doesNeedToMakeMultiPayerDataAvailableNote": doesNeedToMakeMultiPayerDataAvailableNoteExpected,
	}
	// Update and verify the expected fields are updated
	retApproach, err := PlanDataExchangeApproachUpdate(suite.testConfigs.Logger, approach.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(retApproach)
	if suite.NotNil(retApproach.DoesNeedToMakeMultiPayerDataAvailable) {
		suite.EqualValues(multipayerAvailableExpected, *retApproach.DoesNeedToMakeMultiPayerDataAvailable)
	}
	if suite.NotNil(retApproach.DoesNeedToMakeMultiPayerDataAvailableNote) {
		suite.EqualValues(doesNeedToMakeMultiPayerDataAvailableNoteExpected, *retApproach.DoesNeedToMakeMultiPayerDataAvailableNote)
	}
	suite.NotNil(approach.ModifiedBy)
	suite.NotNil(approach.ModifiedDts)

	//Verify that the other fields aren't changed
	suite.Nil(approach.DataToCollectFromParticipants)
	suite.Nil(approach.DataToCollectFromParticipantsReportsDetails)
	suite.Nil(approach.DataToCollectFromParticipantsOther)
	suite.Nil(approach.DataWillNotBeCollectedFromParticipants)
	suite.Nil(approach.DataToCollectFromParticipantsNote)
	suite.Nil(approach.DataToSendToParticipants)
	suite.Nil(approach.DataToSendToParticipantsNote)
	suite.Nil(approach.AnticipatedMultiPayerDataAvailabilityUseCase)
	suite.Nil(approach.DoesNeedToCollectAndAggregateMultiSourceData)
	suite.Nil(approach.MultiSourceDataToCollect)
	suite.Nil(approach.MultiSourceDataToCollectOther)
	suite.Nil(approach.DoesNeedToCollectAndAggregateMultiSourceDataNote)
	suite.Nil(approach.WillImplementNewDataExchangeMethods)
	suite.Nil(approach.NewDataExchangeMethodsDescription)
	suite.Nil(approach.NewDataExchangeMethodsNote)
	suite.Nil(approach.AdditionalDataExchangeConsiderationsDescription)
}
