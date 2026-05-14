package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestWaiverAssessmentSurveyCreate verifies a waiver_assessment_survey row is auto-created with READY status
// when a model plan is created.
func (suite *ResolverSuite) TestWaiverAssessmentSurveyCreate() {
	plan := suite.createModelPlan("Test Waiver Assessment Survey Create")

	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(survey)
	suite.EqualValues(plan.ID, survey.ModelPlanID)
	suite.EqualValues(models.WaiverAssessmentSurveyStatusReady, survey.Status)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, survey.CreatedBy)

	// All question fields should be nil on initial creation
	suite.Nil(survey.ModifiesMedicareSavingsPrograms)
	suite.Nil(survey.BundlesPayments)
	suite.Nil(survey.OffersRiskSharingArrangements)
	suite.Nil(survey.ImpactsSiteOfCarePayments)
	suite.Nil(survey.ImpactsMedicaidOnlyBeneficiaries)
	suite.Nil(survey.AdditionalMedicaidSpecificWaivers)
}

// TestWaiverAssessmentSurveyUpdate verifies that updates to a waiver_assessment_survey persist.
func (suite *ResolverSuite) TestWaiverAssessmentSurveyUpdate() {
	plan := suite.createModelPlan("Test Waiver Assessment Survey Update")

	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(survey)

	changes := map[string]interface{}{
		"modifiesMedicareSavingsPrograms":        helpers.PointerTo(true),
		"modifiesMedicareSavingsProgramsExample": helpers.PointerTo("Some example"),
		"bundlesPayments":                        helpers.PointerTo(false),
		"additionalMedicaidSpecificWaivers":      helpers.PointerTo("Some additional waivers"),
		"status":                                 models.WaiverAssessmentSurveyStatusInProgress,
	}

	updated, err := WaiverAssessmentSurveyUpdate(suite.testConfigs.Context, survey.ID, changes)
	suite.NoError(err)
	suite.NotNil(updated)

	suite.NotNil(updated.ModifiesMedicareSavingsPrograms)
	suite.True(*updated.ModifiesMedicareSavingsPrograms)
	suite.NotNil(updated.ModifiesMedicareSavingsProgramsExample)
	suite.Equal("Some example", *updated.ModifiesMedicareSavingsProgramsExample)
	suite.NotNil(updated.BundlesPayments)
	suite.False(*updated.BundlesPayments)
	suite.NotNil(updated.AdditionalMedicaidSpecificWaivers)
	suite.Equal("Some additional waivers", *updated.AdditionalMedicaidSpecificWaivers)
	suite.Equal(models.WaiverAssessmentSurveyStatusInProgress, updated.Status)
	suite.NotNil(updated.ModifiedBy)
	suite.Equal(suite.testConfigs.Principal.Account().ID, *updated.ModifiedBy)
}

// TestWaiversCreatedWithModelPlan verifies that waiver rows are created (one per common_waiver)
// whenever a model plan is created.
func (suite *ResolverSuite) TestWaiversCreatedWithModelPlan() {
	plan := suite.createModelPlan("Test Waivers Created With Model Plan")

	waivers, err := WaiversGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotEmpty(waivers)

	// Each waiver should be linked to the right model plan, have a non-nil common_waiver_id,
	// and start with will_use_waiver = nil and not_using_reason = nil.
	commonWaiverIDs := map[string]struct{}{}
	for _, w := range waivers {
		suite.EqualValues(plan.ID, w.ModelPlanID)
		suite.NotEqualValues("00000000-0000-0000-0000-000000000000", w.CommonWaiverID.String())
		suite.Nil(w.WillUseWaiver)
		suite.Nil(w.NotUsingReason)
		commonWaiverIDs[w.CommonWaiverID.String()] = struct{}{}
	}
	// Sanity: at least the 15 seeded common_waivers should be associated.
	suite.GreaterOrEqual(len(commonWaiverIDs), 15)
}
