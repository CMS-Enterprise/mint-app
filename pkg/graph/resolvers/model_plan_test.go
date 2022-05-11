package resolvers

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestModelPlanCreate(t *testing.T) {
	tc := GetDefaultTestConfigs()
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  *tc.Principal,
	}
	planName := "Test Plan"

	result, err := ModelPlanCreate(tc.Logger, planName, tc.Store, &principalInfo)

	assert.NoError(t, err)
	assert.NotNil(t, result.ID)
	assert.EqualValues(t, planName, result.ModelName)
	assert.EqualValues(t, principalInfo.EuaUserID, *result.CreatedBy)
	assert.EqualValues(t, principalInfo.EuaUserID, *result.ModifiedBy)
	assert.EqualValues(t, *result.CreatedDts, *result.ModifiedDts)
	assert.EqualValues(t, models.ModelStatusPlanDraft, result.Status)
}

func TestModelPlanUpdate(t *testing.T) {
	tc := GetDefaultTestConfigs()
	updater := "UPDT"
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  *tc.Principal,
	}
	planName := "Test Plan"
	createdPlan, err := ModelPlanCreate(tc.Logger, planName, tc.Store, &principalInfo)
	assert.NoError(t, err)

	changes := map[string]interface{}{
		"modelName": "NEW_AND_IMPROVED",
		"status":    models.ModelStatusIcipComplete,
	}
	result, err := ModelPlanUpdate(tc.Logger, createdPlan.ID, changes, &updater, tc.Store)

	assert.NoError(t, err)
	assert.EqualValues(t, createdPlan.ID, result.ID)
	assert.EqualValues(t, "NEW_AND_IMPROVED", result.ModelName)
	assert.EqualValues(t, models.ModelStatusIcipComplete, result.Status)
	assert.EqualValues(t, *tc.Principal, *result.CreatedBy)
	assert.EqualValues(t, updater, *result.ModifiedBy)
}

func TestModelPlanGetByID(t *testing.T) {
	tc := GetDefaultTestConfigs()
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  *tc.Principal,
	}
	planName := "Test Plan"
	createdPlan, err := ModelPlanCreate(tc.Logger, planName, tc.Store, &principalInfo)
	assert.NoError(t, err)

	result, err := ModelPlanGetByID(tc.Logger, *tc.Principal, createdPlan.ID, tc.Store)

	assert.NoError(t, err)
	assert.EqualValues(t, createdPlan, result)
}

func TestModelPlanCollectionByUser(t *testing.T) {
	tc := GetDefaultTestConfigs()
	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
		EuaUserID:  "UNIQ", // TODO needs to be a uniq user so that it has no other plans (fix with test interdependency)
	}
	planName := "Test Plan"
	createdPlan, err := ModelPlanCreate(tc.Logger, planName, tc.Store, &principalInfo)
	assert.NoError(t, err)

	result, err := ModelPlanCollectionByUser(tc.Logger, principalInfo.EuaUserID, tc.Store)

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Len(t, result, 1)
	assert.EqualValues(t, createdPlan, result[0])
}
