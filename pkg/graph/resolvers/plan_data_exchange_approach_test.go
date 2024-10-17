package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func (suite *ResolverSuite) TestPlanDataExchangeApproachGetByModelPlanIDLoader() {

	plan1 := suite.createModelPlan("model plan 1")
	approach1, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, plan1.ID)
	suite.NoError(err)
	suite.EqualValues(plan1.ID, approach1.ModelPlanID)
	plan2 := suite.createModelPlan("model plan 2")

	approach2, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, plan2.ID)
	suite.NoError(err)
	suite.EqualValues(plan2.ID, approach2.ModelPlanID)
	plan3 := suite.createModelPlan("model plan 3")
	approach3, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, plan3.ID)
	suite.NoError(err)
	suite.EqualValues(plan3.ID, approach3.ModelPlanID)
	expectedResults := []loaders.KeyAndExpected[uuid.UUID, uuid.UUID]{
		{Key: plan1.ID, Expected: approach1.ID},
		{Key: plan2.ID, Expected: approach2.ID},
		{Key: plan3.ID, Expected: approach3.ID},
	}

	verifyFunc := func(data *models.PlanDataExchangeApproach, expected uuid.UUID) bool {
		if suite.NotNil(data) {
			return suite.EqualValues(expected, data.ID)
		}
		return false

	}

	loaders.VerifyLoaders[uuid.UUID, *models.PlanDataExchangeApproach, uuid.UUID](suite.testConfigs.Context, &suite.Suite, loaders.PlanDataExchangeApproach.ByModelPlanID,
		expectedResults, verifyFunc)

}

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

	if suite.NotNil(approach.Status) {
		suite.EqualValues(models.DataExchangeApproachStatusReady, approach.Status)
	}
	suite.NotNil(approach.CreatedBy)
	suite.NotNil(approach.CreatedDts)

	// Assert that the correct approach was returned
	suite.EqualValues(plan1.ID, approach.ModelPlanID)

	multipayerAvailableExpected := true
	doesNeedToMakeMultiPayerDataAvailableNoteExpected := "yes yes yes, make available"

	changes := map[string]interface{}{
		"doesNeedToMakeMultiPayerDataAvailable":     multipayerAvailableExpected,
		"doesNeedToMakeMultiPayerDataAvailableNote": doesNeedToMakeMultiPayerDataAvailableNoteExpected,
	}
	// Update and verify the expected fields are updated
	retApproach, err := PlanDataExchangeApproachUpdate(suite.testConfigs.Context, suite.testConfigs.Logger, approach.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store, nil, nil, email.AddressBook{})
	suite.NoError(err)
	suite.NotNil(retApproach)
	if suite.NotNil(retApproach.DoesNeedToMakeMultiPayerDataAvailable) {
		suite.EqualValues(multipayerAvailableExpected, *retApproach.DoesNeedToMakeMultiPayerDataAvailable)
	}
	if suite.NotNil(retApproach.DoesNeedToMakeMultiPayerDataAvailableNote) {
		suite.EqualValues(doesNeedToMakeMultiPayerDataAvailableNoteExpected, *retApproach.DoesNeedToMakeMultiPayerDataAvailableNote)
	}
	suite.NotNil(retApproach.ModifiedBy)
	suite.NotNil(retApproach.ModifiedDts)
	if suite.NotNil(retApproach.Status) {
		suite.EqualValues(models.DataExchangeApproachStatusInProgress, retApproach.Status)
	}

	//Verify that the other fields aren't changed
	suite.Nil(retApproach.DataToCollectFromParticipants)
	suite.Nil(retApproach.DataToCollectFromParticipantsReportsDetails)
	suite.Nil(retApproach.DataToCollectFromParticipantsOther)
	suite.Nil(retApproach.DataWillNotBeCollectedFromParticipants)
	suite.Nil(retApproach.DataToCollectFromParticipantsNote)
	suite.Nil(retApproach.DataToSendToParticipants)
	suite.Nil(retApproach.DataToSendToParticipantsNote)
	suite.Nil(retApproach.AnticipatedMultiPayerDataAvailabilityUseCase)
	suite.Nil(retApproach.DoesNeedToCollectAndAggregateMultiSourceData)
	suite.Nil(retApproach.MultiSourceDataToCollect)
	suite.Nil(retApproach.MultiSourceDataToCollectOther)
	suite.Nil(retApproach.DoesNeedToCollectAndAggregateMultiSourceDataNote)
	suite.Nil(retApproach.WillImplementNewDataExchangeMethods)
	suite.Nil(retApproach.NewDataExchangeMethodsDescription)
	suite.Nil(retApproach.NewDataExchangeMethodsNote)
	suite.Nil(retApproach.AdditionalDataExchangeConsiderationsDescription)

	changesComplete := map[string]interface{}{
		"isDataExchangeApproachComplete": true,
	}
	// Update and verify that it gets set to completed
	completeApproach, err := PlanDataExchangeApproachUpdate(suite.testConfigs.Context, suite.testConfigs.Logger, approach.ID, changesComplete, suite.testConfigs.Principal, suite.testConfigs.Store, nil, nil, email.AddressBook{})
	suite.NoError(err)
	suite.NotNil(completeApproach)
	if suite.NotNil(completeApproach.Status) {
		suite.EqualValues(models.DataExchangeApproachStatusCompleted, completeApproach.Status)

		if suite.NotNil(completeApproach.MarkedCompleteBy) {
			suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, *completeApproach.MarkedCompleteBy)
		}
		suite.NotNil(completeApproach.MarkedCompleteDts)
	}

	// Update, but don't specify the status with the original change set
	neutralApproach, err := PlanDataExchangeApproachUpdate(suite.testConfigs.Context, suite.testConfigs.Logger, approach.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store, nil, nil, email.AddressBook{})
	suite.NoError(err)
	suite.NotNil(neutralApproach)
	if suite.NotNil(neutralApproach.Status) {
		//Status should remain completed
		suite.EqualValues(models.DataExchangeApproachStatusCompleted, neutralApproach.Status)
	}
	if suite.NotNil(completeApproach.MarkedCompleteBy) {
		suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, *completeApproach.MarkedCompleteBy)
	}
	suite.NotNil(completeApproach.MarkedCompleteDts)

	changesUnComplete := map[string]interface{}{
		"isDataExchangeApproachComplete": false,
	}

	uncompletedApproach, err := PlanDataExchangeApproachUpdate(suite.testConfigs.Context, suite.testConfigs.Logger, approach.ID, changesUnComplete, suite.testConfigs.Principal, suite.testConfigs.Store, nil, nil, email.AddressBook{})
	suite.NoError(err)
	suite.NotNil(uncompletedApproach)
	if suite.NotNil(uncompletedApproach.Status) {
		//Status should remain completed
		suite.EqualValues(models.DataExchangeApproachStatusInProgress, uncompletedApproach.Status)
	}
	suite.Nil(uncompletedApproach.MarkedCompleteDts)
	suite.Nil(uncompletedApproach.MarkedCompleteBy)
}
