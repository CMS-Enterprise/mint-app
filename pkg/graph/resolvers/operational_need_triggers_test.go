package resolvers

import (
	"reflect"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestGeneralCharacteristicsNeeds() {
	plan := suite.createModelPlan("plan for need")

	gc, err := FetchPlanGeneralCharacteristicsByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	changes := map[string]interface{}{
		"managePartCDEnrollment": false, // NEED 1, MANAGE_CD
		// "collectPlanBids":        true, // NEED 2, MANAGE_CD &&  3 UPDATE_CONTRACT
	}
	updatedGeneralCharacteristics, err := UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.EUAID, *updatedGeneralCharacteristics.ModifiedBy)

	opNeeds, err := OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NotNil(opNeeds)
	suite.NoError(err)
	manageCD := findOpNeed(opNeeds, models.OpNKManageCd)

	suite.NotNil(manageCD)
	suite.False(*manageCD.Needed)

	updateContract := findOpNeed(opNeeds, models.OpNKUpdateContract)
	suite.NotNil(updateContract)
	revColBids := findOpNeed(opNeeds, models.OpNKRevColBids)
	suite.NotNil(revColBids)

	suite.Nil(updateContract.Needed)
	suite.Nil(revColBids.Needed)

	changes = map[string]interface{}{
		"managePartCDEnrollment": true,  // NEED 1, MANAGE_CD
		"collectPlanBids":        false, // NEED 2, MANAGE_CD &&  3 UPDATE_CONTRACT
	}

	updatedGeneralCharacteristics, err = UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.EUAID, *updatedGeneralCharacteristics.ModifiedBy)

	opNeeds, err = OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	manageCD = findOpNeed(opNeeds, models.OpNKManageCd)
	updateContract = findOpNeed(opNeeds, models.OpNKUpdateContract)
	revColBids = findOpNeed(opNeeds, models.OpNKRevColBids)

	suite.True(*manageCD.Needed)
	suite.False(*updateContract.Needed)
	suite.False(*revColBids.Needed)

}
func (suite *ResolverSuite) TestCompositeColumnNeedTrigger() {
	plan := suite.createModelPlan("plan for complex need")

	oelExisting, err := PlanOpsEvalAndLearningGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(oelExisting)

	changes := map[string]interface{}{ // NEED 13, PROCESS_PART_APPEALS

		"appealNote": "we are testing appeal statements",
	}

	oel, err := PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)
	opNeeds, err := OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	processPart := findOpNeed(opNeeds, models.OpNKProcessPartAppeals)
	suite.NotNil(processPart)
	suite.Nil(processPart.Needed) // Un-Answered

	changes = map[string]interface{}{
		"appealFeedback": true,
		// "appealPayments": false,
		// "appealOther":    false,
		"appealPerformance": true,
	}

	oel, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)

	opNeeds, err = OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	processPart = findOpNeed(opNeeds, models.OpNKProcessPartAppeals)
	suite.NotNil(processPart)
	suite.True(*processPart.Needed)

	changes = map[string]interface{}{
		// "appealFeedback": true,
		"appealPayments": false,
		"appealOther":    false,
		// "appealPerformance": true,
	}
	oel, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)

	opNeeds, err = OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	processPart = findOpNeed(opNeeds, models.OpNKProcessPartAppeals)
	suite.NotNil(processPart)
	suite.True(*processPart.Needed) // Still needed because the other appeal values are set to true, even though the only changed columsn are false

	changes = map[string]interface{}{
		"appealFeedback": false,
		// "appealPayments": false,
		// "appealOther":    false,
		"appealPerformance": false,
	}
	oel, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)

	opNeeds, err = OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	processPart = findOpNeed(opNeeds, models.OpNKProcessPartAppeals)
	suite.NotNil(processPart)
	suite.False(*processPart.Needed) // Now, no composite column has  a true value, so it is not needed

}

func findOpNeed(collection []*models.OperationalNeed, key models.OperationalNeedKey) *models.OperationalNeed {

	for i := 0; i < len(collection); i++ {
		if reflect.DeepEqual(collection[i].Key, &key) {
			return collection[i]
		}
	}
	return nil

}
