package resolvers

import (
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestModelPlanCreate() {
	planName := "Test Plan"
	result, err := ModelPlanCreate(suite.testConfigs.Logger, planName, suite.testConfigs.Store, suite.testConfigs.UserInfo)

	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), result.ID)
	assert.EqualValues(suite.T(), planName, result.ModelName)
	assert.EqualValues(suite.T(), false, result.Archived)
	assert.EqualValues(suite.T(), suite.testConfigs.UserInfo.EuaUserID, *result.CreatedBy)
	assert.EqualValues(suite.T(), suite.testConfigs.UserInfo.EuaUserID, *result.ModifiedBy)
	assert.EqualValues(suite.T(), *result.CreatedDts, *result.ModifiedDts)
	assert.EqualValues(suite.T(), models.ModelStatusPlanDraft, result.Status)
}

func (suite *ResolverSuite) TestModelPlanUpdate() {
	plan := createModelPlan(suite.T(), suite.testConfigs)

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

	assert.NoError(suite.T(), err)
	assert.EqualValues(suite.T(), plan.ID, result.ID)
	assert.EqualValues(suite.T(), changes["modelName"], result.ModelName)
	assert.EqualValues(suite.T(), changes["archived"], result.Archived)
	assert.EqualValues(suite.T(), changes["cmsCenters"], result.CMSCenters)
	assert.EqualValues(suite.T(), changes["cmsOther"], *result.CMSOther)
	assert.EqualValues(suite.T(), changes["cmmiGroups"], result.CMMIGroups)
	assert.EqualValues(suite.T(), changes["status"], result.Status)
	assert.EqualValues(suite.T(), suite.testConfigs.UserInfo.EuaUserID, *result.CreatedBy)
	assert.EqualValues(suite.T(), updater, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestModelPlanGetByID() {
	plan := createModelPlan(suite.T(), suite.testConfigs)

	result, err := ModelPlanGetByID(suite.testConfigs.Logger, suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)

	assert.NoError(suite.T(), err)
	assert.EqualValues(suite.T(), plan, result)
}

func (suite *ResolverSuite) TestModelPlanCollectionByUser() {
	plan := createModelPlan(suite.T(), suite.testConfigs)

	result, err := ModelPlanCollectionByUser(suite.testConfigs.Logger, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)

	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), result)
	assert.Len(suite.T(), result, 1)
	assert.EqualValues(suite.T(), plan, result[0])
}
