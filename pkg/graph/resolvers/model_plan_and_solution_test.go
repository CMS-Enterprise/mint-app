package resolvers

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) createModelPlanWithNeedAndOpSol(
	needType models.OperationalNeedKey,
	solType models.OperationalSolutionKey,
) (*models.ModelPlan, *models.OperationalSolution) {
	plan := suite.createModelPlan("plan for solutions")

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(
		suite.testConfigs.Logger,
		plan.ID,
		needType,
	)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["needed"] = true

	opSol, err := OperationalSolutionCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		need.ID,
		&solType,
		changes,
		suite.testConfigs.Principal,
	)
	suite.NoError(err)

	return plan, opSol
}

// TestModelPlanGetByOperationalSolutionKey is the test function for ModelPlanGetByOperationalSolutionKey
func (suite *ResolverSuite) TestModelPlanGetByOperationalSolutionKey() {
	needType := models.OpNKManageCd
	solType := models.OpSKMarx

	plan, _ := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(plan.ID, modelPlanAndOpSols[0].ModelPlanID)
	suite.EqualValues(solType, modelPlanAndOpSols[0].Key)
}

// TestModelPlanWithoutOperationalSolution checks if a model plan without a valid operational solution is not fetched
func (suite *ResolverSuite) TestModelPlanWithoutOperationalSolution() {
	plan := suite.createModelPlan("plan without solutions")
	needType := models.OpNKManageCd
	solType := models.OpSKMarx

	// Creating a need without a solution
	_, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(
		suite.testConfigs.Logger,
		plan.ID,
		needType,
	)
	suite.NoError(err)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	suite.NoError(err)
	suite.Empty(modelPlanAndOpSols)
}

// TestModelPlanWithMultipleSolutionsOfSameType asserts that when a model plan uses a solution multiple times ( for different needs), you only get on instance of the plan returned
func (suite *ResolverSuite) TestModelPlanWithMultipleSolutionsOfSameType() {

	plan := suite.createModelPlan("plan without multiple uses of the same solution")

	needed := true
	customNeed := "To test my Operational Solution resolver Logic"
	need1, err := OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, customNeed, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(need1)

	customNeed2 := "To test my Operational Solution resolver Logic 2"
	need2, err := OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, customNeed2, needed, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(need2)

	changes := map[string]interface{}{}
	changes["needed"] = true

	solType := models.OpSKAcoOs

	opSol1, err := OperationalSolutionCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		need1.ID,
		&solType,
		changes,
		suite.testConfigs.Principal,
	)
	suite.NoError(err)
	suite.NotNil(opSol1)
	opSol2, err := OperationalSolutionCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		need2.ID,
		&solType,
		changes,
		suite.testConfigs.Principal,
	)
	suite.NoError(err)
	suite.NotNil(opSol2)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)

}

// TestMultipleModelPlansWithSameSolutionType checks if multiple model plans with the same solution type are fetched
func (suite *ResolverSuite) TestMultipleModelPlansWithSameSolutionType() {
	needType := models.OpNKManageCd
	solType := models.OpSKMarx

	mpA, _ := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)

	mpB, _ := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	mpIDS := []uuid.UUID{mpA.ID, mpB.ID}
	suite.NoError(err)
	if suite.NotNil(modelPlanAndOpSols) {
		suite.Len(modelPlanAndOpSols, 2)
		suite.Contains(mpIDS, modelPlanAndOpSols[0].ModelPlanID)
		suite.EqualValues(solType, modelPlanAndOpSols[0].Key)

		suite.Contains(mpIDS, modelPlanAndOpSols[1].ModelPlanID)
		suite.EqualValues(solType, modelPlanAndOpSols[1].Key)
	}
}

// TestMultipleModelPlansWithDifferentSolutionTypes checks if only the matching solution type is fetched
func (suite *ResolverSuite) TestMultipleModelPlansWithDifferentSolutionTypes() {
	needType := models.OpNKManageCd
	solTypeA := models.OpSKMarx
	solTypeB := models.OpSKCcw

	mpA, _ := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solTypeA,
	)

	mpB, _ := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solTypeB,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solTypeA,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(mpA.ID, modelPlanAndOpSols[0].ModelPlanID)
	suite.EqualValues(solTypeA, modelPlanAndOpSols[0].Key)

	modelPlanAndOpSols, err = suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solTypeB,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(mpB.ID, modelPlanAndOpSols[0].ModelPlanID)
	suite.EqualValues(solTypeB, modelPlanAndOpSols[0].Key)
}

func TestModelBySolutionStatus(t *testing.T) {
	assert := assert.New(t)

	testCases := []struct {
		testName             string
		inputStatus          models.ModelStatus
		expectedOutputStatus models.ModelBySolutionStatus
	}{
		{
			testName:             "Active_To_Active",
			inputStatus:          models.ModelStatusActive,
			expectedOutputStatus: models.MbSSActive,
		},
		{
			testName:             "Ended_To_Ended",
			inputStatus:          models.ModelStatusPlanDraft,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "Cancelled_To_Other",
			inputStatus:          models.ModelStatusCanceled,
			expectedOutputStatus: models.MbSSOther,
		},
		{
			testName:             "Paused_To_Other",
			inputStatus:          models.ModelStatusPaused,
			expectedOutputStatus: models.MbSSOther,
		},

		// The remaining statuses all go to Planned
		{
			testName:             "PlanDraft_To_Planned",
			inputStatus:          models.ModelStatusPlanDraft,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "PlanComplete_To_Planned",
			inputStatus:          models.ModelStatusPlanComplete,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "IcipComplete_To_Planned",
			inputStatus:          models.ModelStatusIcipComplete,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "InternalCmmiClearance_To_Planned",
			inputStatus:          models.ModelStatusInternalCmmiClearance,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "CmsClearance_To_Planned",
			inputStatus:          models.ModelStatusCmsClearance,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "HhsClearance_To_Planned",
			inputStatus:          models.ModelStatusHhsClearance,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "OmbAsrfClearance_To_Planned",
			inputStatus:          models.ModelStatusOmbAsrfClearance,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "Cleared_To_Planned",
			inputStatus:          models.ModelStatusCleared,
			expectedOutputStatus: models.MbSSPlanned,
		},
		{
			testName:             "Announced_To_Planned",
			inputStatus:          models.ModelStatusAnnounced,
			expectedOutputStatus: models.MbSSPlanned,
		},
	}

	for _, test := range testCases {
		t.Run(test.testName, func(t *testing.T) {
			outputStatus := ModelBySolutionStatus(test.inputStatus)
			assert.EqualValues(test.expectedOutputStatus, outputStatus, "Expected status did not match")
		})

	}

}
