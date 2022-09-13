package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestModelPlanCreate() {
	planName := "Test Plan"
	result, err := ModelPlanCreate(suite.testConfigs.Logger, planName, suite.testConfigs.Store, suite.testConfigs.UserInfo, suite.testConfigs.Principal)

	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(planName, result.ModelName)
	suite.EqualValues(false, result.Archived)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, result.CreatedBy)
	suite.Nil(result.ModifiedBy)
	suite.Nil(result.ModifiedDts)
	suite.EqualValues(models.ModelStatusPlanDraft, result.Status)
}

func (suite *ResolverSuite) TestModelPlanUpdate() {
	plan := suite.createModelPlan("Test Plan")

	changes := map[string]interface{}{
		"modelName": "NEW_AND_IMPROVED",
		"status":    models.ModelStatusIcipComplete,
		"archived":  true,
	}
	result, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store) // update plan with new user "UPDT"

	suite.NoError(err)
	suite.EqualValues(plan.ID, result.ID)
	suite.EqualValues(changes["modelName"], result.ModelName)
	suite.EqualValues(changes["archived"], result.Archived)

	suite.EqualValues(changes["status"], result.Status)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, result.CreatedBy)
	suite.NotNil(result.ModifiedBy)
	suite.NotNil(result.ModifiedDts)
	suite.EqualValues(suite.testConfigs.Principal.EUAID, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestModelPlanGetByID() {
	plan := suite.createModelPlan("Test Plan")

	result, err := ModelPlanGetByID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(plan, result)
}

func (suite *ResolverSuite) TestModelPlanCollectionByUser() {
	plan := suite.createModelPlan("Test Plan")

	result, err := ModelPlanCollection(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 1)
	suite.EqualValues(plan, result[0])
}
