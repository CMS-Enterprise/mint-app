package resolvers

// import (
// 	"testing"

// 	"github.com/cmsgov/mint-app/pkg/models"

// 	"github.com/google/uuid"
// 	"github.com/stretchr/testify/assert"
// )

// func TestCreatePlanBasics(t *testing.T) {
// 	tc := GetDefaultTestConfigs()

// 	basics := models.PlanBasics{}

// 	basics.ID = uuid.MustParse("0576c351-c480-4f85-97a4-b7c1d691a3cb")
// 	basics.ModelPlanID = uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")

// 	result, err := CreatePlanBasics(tc.Logger, &basics, tc.Principal, tc.Store)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)
// }

// func TestUpdatePlanBasics(t *testing.T) {
// 	tc := GetDefaultTestConfigs()

// 	basics := models.PlanBasics{}
// 	basics.Problem = models.StringPointer("This is a problem")
// 	basics.ModifiedBy = tc.Principal
// 	basics.CreatedBy = tc.Principal

// 	basics.ID = uuid.MustParse("0576c351-c480-4f85-97a4-b7c1d691a3cb")
// 	basics.ModelPlanID = uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")

// 	result, err := UpdatePlanBasics(tc.Logger, &basics, tc.Principal, tc.Store)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)

// 	assert.EqualValues(t, basics.Problem, result.Problem)
// }

// func TestPlanBasicsGetByModelPlanID(t *testing.T) {
// 	tc := GetDefaultTestConfigs()

// 	basics := models.PlanBasics{}
// 	basics.Problem = models.StringPointer("This is a problem")
// 	basics.ModifiedBy = tc.Principal
// 	basics.CreatedBy = tc.Principal

// 	basics.ID = uuid.MustParse("0576c351-c480-4f85-97a4-b7c1d691a3cb")
// 	modelPlanID := uuid.MustParse("85b3ff03-1be2-4870-b02f-55c764500e48")

// 	result, err := PlanBasicsGetByModelPlanID(tc.Logger, tc.Principal, modelPlanID, tc.Store)
// 	assert.NoError(t, err)
// 	assert.NotNil(t, result.ID)

// 	assert.EqualValues(t, modelPlanID, result.ModelPlanID)
// }

// func TestFetchPlanBasicsByID(t *testing.T) {
// 	tc := GetDefaultTestConfigs()

// 	id := uuid.MustParse("0576c351-c480-4f85-97a4-b7c1d691a3cb")

// 	plan, err := FetchPlanBasicsByID(tc.Logger, id, tc.Store)
// 	assert.Nil(t, err)
// 	assert.NotNil(t, plan)
// }
