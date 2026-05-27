package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
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

// TestWaiverAssessmentSurveyUpdate verifies that updates to a waiver_assessment_survey persist
// and that the WAIVER_ASSESSMENT_SURVEY plan task status is kept in sync.
func (suite *ResolverSuite) TestWaiverAssessmentSurveyUpdate() {
	plan := suite.createModelPlan("Test Waiver Assessment Survey Update")

	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(survey)

	// Update fields and transition to IN_PROGRESS
	changes := map[string]interface{}{
		"modifiesMedicareSavingsPrograms":        helpers.PointerTo(true),
		"modifiesMedicareSavingsProgramsExample": helpers.PointerTo("Some example"),
		"bundlesPayments":                        helpers.PointerTo(false),
		"additionalMedicaidSpecificWaivers":      helpers.PointerTo("Some additional waivers"),
		"status":                                 models.WaiverAssessmentSurveyStatusInProgress,
	}

	updated, err := WaiverAssessmentSurveyUpdate(suite.testConfigs.Context, suite.testConfigs.Logger, survey.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store, nil, email.AddressBook{})
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

	// Plan task should now be IN_PROGRESS
	task := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyWaiverAssessmentSurvey)
	suite.Equal(models.PlanTaskStatusInProgress, task.Status)

	// Transition to COMPLETE and verify the plan task follows
	_, err = WaiverAssessmentSurveyUpdate(suite.testConfigs.Context, suite.testConfigs.Logger, survey.ID, map[string]interface{}{
		"status": models.WaiverAssessmentSurveyStatusComplete,
	}, suite.testConfigs.Principal, suite.testConfigs.Store, nil, email.AddressBook{})
	suite.NoError(err)

	task = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyWaiverAssessmentSurvey)
	suite.Equal(models.PlanTaskStatusComplete, task.Status)
}

// TestWaiverAssessmentSurveyAutoTransition verifies that saving any answer without an explicit
// status automatically moves the survey from READY to IN_PROGRESS.
func (suite *ResolverSuite) TestWaiverAssessmentSurveyAutoTransition() {
	plan := suite.createModelPlan("Test Waiver Assessment Survey Auto Transition")

	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Equal(models.WaiverAssessmentSurveyStatusReady, survey.Status)

	// Save an answer without sending status
	updated, err := WaiverAssessmentSurveyUpdate(suite.testConfigs.Context, suite.testConfigs.Logger, survey.ID, map[string]interface{}{
		"bundlesPayments": helpers.PointerTo(true),
	}, suite.testConfigs.Principal, suite.testConfigs.Store, nil, email.AddressBook{})
	suite.NoError(err)
	suite.Equal(models.WaiverAssessmentSurveyStatusInProgress, updated.Status)

	task := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyWaiverAssessmentSurvey)
	suite.Equal(models.PlanTaskStatusInProgress, task.Status)
}

// TestWaiversNotPreCreatedWithModelPlan verifies that no waiver rows are pre-created when a
// model plan is created. Waivers will be created on demand from suggested waivers (MINT-3718).
func (suite *ResolverSuite) TestWaiversNotPreCreatedWithModelPlan() {
	plan := suite.createModelPlan("Test Waivers Not Pre-Created With Model Plan")

	waivers, err := WaiversGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Empty(waivers)
}
