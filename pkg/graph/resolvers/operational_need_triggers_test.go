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

func findOpNeed(collection []*models.OperationalNeed, key models.OperationalNeedKey) *models.OperationalNeed {

	for i := 0; i < len(collection); i++ {
		if reflect.DeepEqual(collection[i].Key, &key) {
			return collection[i]
		}
	}
	return nil

}
