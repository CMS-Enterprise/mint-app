package resolvers

import (
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestModelPlanCreate() {
	tc := GetDefaultTestConfigs()
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  *tc.Principal,
	}
	planName := "Test Plan"

	result, err := ModelPlanCreate(tc.Logger, planName, tc.Store, &principalInfo)

	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), result.ID)
	assert.EqualValues(suite.T(), planName, result.ModelName)
	assert.EqualValues(suite.T(), principalInfo.EuaUserID, *result.CreatedBy)
	assert.EqualValues(suite.T(), principalInfo.EuaUserID, *result.ModifiedBy)
	assert.EqualValues(suite.T(), *result.CreatedDts, *result.ModifiedDts)
	assert.EqualValues(suite.T(), models.ModelStatusPlanDraft, result.Status)
}

func (suite *ResolverSuite) TestModelPlanUpdate() {
	tc := GetDefaultTestConfigs()
	updater := "UPDT"
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  *tc.Principal,
	}
	planName := "Test Plan"
	createdPlan, err := ModelPlanCreate(tc.Logger, planName, tc.Store, &principalInfo)
	assert.NoError(suite.T(), err)

	changes := map[string]interface{}{
		"modelName": "NEW_AND_IMPROVED",
		"status":    models.ModelStatusIcipComplete,
	}
	result, err := ModelPlanUpdate(tc.Logger, createdPlan.ID, changes, &updater, tc.Store)

	assert.NoError(suite.T(), err)
	assert.EqualValues(suite.T(), createdPlan.ID, result.ID)
	assert.EqualValues(suite.T(), "NEW_AND_IMPROVED", result.ModelName)
	assert.EqualValues(suite.T(), models.ModelStatusIcipComplete, result.Status)
	assert.EqualValues(suite.T(), *tc.Principal, *result.CreatedBy)
	assert.EqualValues(suite.T(), updater, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestModelPlanGetByID() {
	tc := GetDefaultTestConfigs()
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  *tc.Principal,
	}
	planName := "Test Plan"
	createdPlan, err := ModelPlanCreate(tc.Logger, planName, tc.Store, &principalInfo)
	assert.NoError(suite.T(), err)

	result, err := ModelPlanGetByID(tc.Logger, *tc.Principal, createdPlan.ID, tc.Store)

	assert.NoError(suite.T(), err)
	assert.EqualValues(suite.T(), createdPlan, result)
}

func (suite *ResolverSuite) TestModelPlanCollectionByUser() {
	tc := GetDefaultTestConfigs()
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester names",
		EuaUserID:  *tc.Principal, // TODO needs to be a uniq user so that it has no other plans (fix with test interdependency)
	}
	planName := "Test Plan"
	createdPlan, err := ModelPlanCreate(tc.Logger, planName, tc.Store, &principalInfo)
	assert.NoError(suite.T(), err)

	result, err := ModelPlanCollectionByUser(tc.Logger, principalInfo.EuaUserID, tc.Store)

	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), result)
	assert.Len(suite.T(), result, 1)
	assert.EqualValues(suite.T(), createdPlan, result[0])
}
