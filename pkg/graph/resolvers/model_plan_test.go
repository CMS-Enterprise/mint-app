package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestModelPlanCreate() {
	planName := "Test Plan"
	result, err := ModelPlanCreate(suite.testConfigs.Logger, planName, suite.testConfigs.Store, suite.testConfigs.UserInfo)

	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(planName, result.ModelName)
	suite.EqualValues(false, result.Archived)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, *result.CreatedBy)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, *result.ModifiedBy)
	suite.EqualValues(*result.CreatedDts, *result.ModifiedDts)
	suite.EqualValues(models.ModelStatusPlanDraft, result.Status)
}

func (suite *ResolverSuite) TestModelPlanUpdate() {
	plan := suite.createModelPlan("Test Plan")

	changes := map[string]interface{}{
		"modelName":  "NEW_AND_IMPROVED",
		"status":     models.ModelStatusIcipComplete,
		"archived":   true,
		"cmsCenters": []string{"CMMI", "OTHER"},
		"cmsOther":   "SOME OTHER CMS CENTER",
		"cmmiGroups": []string{"PATIENT_CARE_MODELS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"},
	}
	updater := "UPDT"
	result, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, changes, &updater, suite.testConfigs.Store) // update plan with new user "UPDT"

	suite.NoError(err)
	suite.EqualValues(plan.ID, result.ID)
	suite.EqualValues(changes["modelName"], result.ModelName)
	suite.EqualValues(changes["archived"], result.Archived)
	suite.EqualValues(changes["cmsCenters"], result.CMSCenters)
	suite.EqualValues(changes["cmsOther"], *result.CMSOther)
	suite.EqualValues(changes["cmmiGroups"], result.CMMIGroups)
	suite.EqualValues(changes["status"], result.Status)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, *result.CreatedBy)
	suite.EqualValues(updater, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestModelPlanGetByID() {
	plan := suite.createModelPlan("Test Plan")

	result, err := ModelPlanGetByID(suite.testConfigs.Logger, suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(plan, result)
}

func (suite *ResolverSuite) TestModelPlanCollectionByUser() {
	plan := suite.createModelPlan("Test Plan")

	result, err := ModelPlanCollectionByUser(suite.testConfigs.Logger, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)

	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 1)
	suite.EqualValues(plan, result[0])
}
