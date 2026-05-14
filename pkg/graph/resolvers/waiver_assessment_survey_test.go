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

// TestWaiversNotPreCreatedWithModelPlan verifies that no waiver rows are pre-created when a
// model plan is created. Waivers will be created on demand from suggested waivers (MINT-3718).
func (suite *ResolverSuite) TestWaiversNotPreCreatedWithModelPlan() {
	plan := suite.createModelPlan("Test Waivers Not Pre-Created With Model Plan")

	waivers, err := WaiversGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Empty(waivers)
}
