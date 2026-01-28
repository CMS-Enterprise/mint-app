package resolvers

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestModelByGeneralStatus(t *testing.T) {
	assert := assert.New(t)

	testCases := []struct {
		testName             string
		inputStatus          models.ModelStatus
		expectedOutputStatus models.GeneralStatus
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
			outputStatus := GeneralStatus(test.inputStatus)
			assert.EqualValues(test.expectedOutputStatus, outputStatus, "Expected status did not match")
		})

	}

}

func (suite *ResolverSuite) TestModelPlansByMTOSolutionKey() {
	plan1 := suite.createModelPlan("plan1")
	plan2 := suite.createModelPlan("plan2")

	plans, err := ModelPlansByMTOSolutionKey(suite.testConfigs.Context, models.MTOCSKInnovation)
	suite.NoError(err)
	suite.Len(plans, 0)

	// add solution to plan 1
	suite.createMTOSolutionCommon(plan1.ID, models.MTOCSKInnovation, []uuid.UUID{})

	// Check that no plans are using this solution
	plans, err = ModelPlansByMTOSolutionKey(suite.testConfigs.Context, models.MTOCSKInnovation)
	suite.NoError(err)
	if suite.Len(plans, 1) {
		plans[0].ModelPlanID = plan1.ID
	}
	// add solution to plan 2
	suite.createMTOSolutionCommon(plan2.ID, models.MTOCSKInnovation, []uuid.UUID{})
	// Check that no plans are using this solution
	plans, err = ModelPlansByMTOSolutionKey(suite.testConfigs.Context, models.MTOCSKInnovation)
	suite.NoError(err)
	suite.Len(plans, 2)

}
