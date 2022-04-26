package resolvers

import (
	"fmt"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestModelPlanCreate(t *testing.T) {
	tc := GetDefaultTestConfigs()
	plan := models.ModelPlan{}
	plan.ID = uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")
	plan.CreatedBy = tc.Principal
	plan.ModifiedBy = tc.Principal

	config := NewDBConfig()
	fmt.Print(config)

	principalInfo := models.UserInfo{
		CommonName: "Fake Tester name",
	}

	result, err := ModelPlanCreate(tc.Logger, &plan, tc.Store, &principalInfo)
	assert.NoError(t, err)
	assert.NotNil(t, result.ID)
}
func TestModelPlanUpdate(t *testing.T) {
	tc := GetDefaultTestConfigs()
	modelName := models.StringPointer("My Test model")

	plan := models.ModelPlan{}
	plan.ID = uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")
	plan.ModifiedBy = tc.Principal
	plan.CreatedBy = tc.Principal
	plan.ModelName = modelName

	result, err := ModelPlanUpdate(tc.Logger, &plan, tc.Store)

	assert.NoError(t, err)
	assert.NotNil(t, result.ID)
	assert.EqualValues(t, result.ModelName, plan.ModelName)
}
func TestModelPlanGetByID(t *testing.T) {
	tc := GetDefaultTestConfigs()

	uuid := uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")
	result, err := ModelPlanGetByID(tc.Logger, *tc.Principal, uuid, tc.Store)

	assert.NoError(t, err)
	assert.NotNil(t, result.ID)
}
func TestModelPlanCollectionByUser(t *testing.T) {
	tc := GetDefaultTestConfigs()

	result, err := ModelPlanCollectionByUser(tc.Logger, *tc.Principal, tc.Store)

	assert.NoError(t, err)
	assert.NotNil(t, result)
}
