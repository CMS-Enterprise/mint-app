package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestIDDOCQuestionnaireNeededTriggerOnOEL tests that the IDDOC questionnaire `needed` field
// is automatically synced when the plan_ops_eval_and_learning.iddoc_support field changes
func (suite *ResolverSuite) TestIDDOCQuestionnaireNeededTriggerOnOEL() {
	plan := suite.createModelPlan("plan for IDDOC questionnaire trigger test on OEL")

	// Get the IDDOC questionnaire that was created with the model plan
	iddocQuestionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(iddocQuestionnaire)
	suite.False(iddocQuestionnaire.Needed, "IDDOC questionnaire should not be needed initially")

	// Get the OEL section
	oel, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(oel)

	// Update iddoc_support to true - this should trigger the IDDOC questionnaire to become needed
	changes := map[string]interface{}{
		"iddocSupport": true,
	}

	updatedOEL, err := PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oel.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(updatedOEL)
	suite.True(*updatedOEL.IddocSupport)

	// Reload the IDDOC questionnaire and verify that `needed` is now true (due to the database trigger)
	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.True(iddocQuestionnaire.Needed, "IDDOC questionnaire should be needed after iddoc_support is set to true")

	// Update iddoc_support to false - this should trigger the IDDOC questionnaire to become not needed
	changes = map[string]interface{}{
		"iddocSupport": false,
	}

	updatedOEL, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oel.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(updatedOEL)
	suite.False(*updatedOEL.IddocSupport)

	// Reload the IDDOC questionnaire and verify that `needed` is now false (due to the database trigger)
	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.False(iddocQuestionnaire.Needed, "IDDOC questionnaire should not be needed after iddoc_support is set to false")
}

// TestIDDOCQuestionnaireNeededTriggerOnSolution tests that the IDDOC questionnaire `needed` field
// is automatically synced when INNOVATION or ACO_OS solutions are added, updated, or deleted
func (suite *ResolverSuite) TestIDDOCQuestionnaireNeededTriggerOnSolution() {
	plan := suite.createModelPlan("plan for IDDOC questionnaire trigger test on solution")

	// Get the IDDOC questionnaire that was created with the model plan
	iddocQuestionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(iddocQuestionnaire)
	suite.False(iddocQuestionnaire.Needed, "IDDOC questionnaire should not be needed initially")

	// Add an INNOVATION solution - this should trigger the IDDOC questionnaire to become needed
	innovationSolution, err := MTOSolutionCreateCommon(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil, // emailService
		email.AddressBook{},
		plan.ID,
		models.MTOCSKInnovation,
		[]uuid.UUID{}, // milestonesToLink
	)
	suite.NoError(err)
	suite.NotNil(innovationSolution)
	suite.Equal(models.MTOCSKInnovation, *innovationSolution.Key)

	// Reload the IDDOC questionnaire and verify that `needed` is now true (due to the database trigger)
	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.True(iddocQuestionnaire.Needed, "IDDOC questionnaire should be needed after INNOVATION solution is added")

	// Delete the INNOVATION solution - this should trigger the IDDOC questionnaire to become not needed
	err = MTOSolutionDelete(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, innovationSolution.ID)
	suite.NoError(err)

	// Reload the IDDOC questionnaire and verify that `needed` is now false (due to the database trigger)
	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.False(iddocQuestionnaire.Needed, "IDDOC questionnaire should not be needed after INNOVATION solution is deleted")

	// Now test with ACO_OS solution
	acoOSSolution, err := MTOSolutionCreateCommon(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil, // emailService
		email.AddressBook{},
		plan.ID,
		models.MTOCSKAcoOs,
		[]uuid.UUID{}, // milestonesToLink
	)
	suite.NoError(err)
	suite.NotNil(acoOSSolution)
	suite.Equal(models.MTOCSKAcoOs, *acoOSSolution.Key)

	// Reload the IDDOC questionnaire and verify that `needed` is now true (due to the database trigger)
	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.True(iddocQuestionnaire.Needed, "IDDOC questionnaire should be needed after ACO_OS solution is added")
}

// TestIDDOCQuestionnaireNeededTriggerOnMilestone tests that the IDDOC questionnaire `needed` field
// is automatically synced when IDDOC_SUPPORT milestone is added, updated, or deleted
func (suite *ResolverSuite) TestIDDOCQuestionnaireNeededTriggerOnMilestone() {
	plan := suite.createModelPlan("plan for IDDOC questionnaire trigger test on milestone")

	// Get the IDDOC questionnaire that was created with the model plan
	iddocQuestionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(iddocQuestionnaire)
	suite.False(iddocQuestionnaire.Needed, "IDDOC questionnaire should not be needed initially")

	// Add an IDDOC_SUPPORT milestone - this should trigger the IDDOC questionnaire to become needed
	iddocSupportMilestone, err := MTOMilestoneCreateCommon(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil, // emailService
		email.AddressBook{},
		plan.ID,
		models.MTOCommonMilestoneKeyIddocSupport,
		[]models.MTOCommonSolutionKey{}, // commonSolutions
	)
	suite.NoError(err)
	suite.NotNil(iddocSupportMilestone)
	suite.Equal(models.MTOCommonMilestoneKeyIddocSupport, *iddocSupportMilestone.Key)

	// Reload the IDDOC questionnaire and verify that `needed` is now true (due to the database trigger)
	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.True(iddocQuestionnaire.Needed, "IDDOC questionnaire should be needed after IDDOC_SUPPORT milestone is added")

	// Delete the IDDOC_SUPPORT milestone - this should trigger the IDDOC questionnaire to become not needed
	err = MTOMilestoneDelete(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, iddocSupportMilestone.ID)
	suite.NoError(err)

	// Reload the IDDOC questionnaire and verify that `needed` is now false (due to the database trigger)
	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.False(iddocQuestionnaire.Needed, "IDDOC questionnaire should not be needed after IDDOC_SUPPORT milestone is deleted")
}

// TestIDDOCQuestionnaireNeededTriggerMultipleConditions tests that the IDDOC questionnaire `needed` field
// remains true when multiple conditions are met, and only becomes false when all conditions are unmet
func (suite *ResolverSuite) TestIDDOCQuestionnaireNeededTriggerMultipleConditions() {
	plan := suite.createModelPlan("plan for IDDOC questionnaire trigger test with multiple conditions")

	// Get the IDDOC questionnaire that was created with the model plan
	iddocQuestionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(iddocQuestionnaire)
	suite.False(iddocQuestionnaire.Needed, "IDDOC questionnaire should not be needed initially")

	// Get the OEL section
	oel, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(oel)

	// Set iddoc_support to true
	changes := map[string]interface{}{
		"iddocSupport": true,
	}
	_, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oel.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	// Add an INNOVATION solution
	innovationSolution, err := MTOSolutionCreateCommon(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil, // emailService
		email.AddressBook{},
		plan.ID,
		models.MTOCSKInnovation,
		[]uuid.UUID{}, // milestonesToLink
	)
	suite.NoError(err)
	suite.NotNil(innovationSolution)

	// Reload the IDDOC questionnaire - it should be needed
	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.True(iddocQuestionnaire.Needed, "IDDOC questionnaire should be needed when multiple conditions are met")

	// Remove the INNOVATION solution - IDDOC questionnaire should still be needed because iddoc_support is true
	err = MTOSolutionDelete(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, innovationSolution.ID)
	suite.NoError(err)

	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.True(iddocQuestionnaire.Needed, "IDDOC questionnaire should still be needed because iddoc_support is true")

	// Set iddoc_support to false - now IDDOC questionnaire should not be needed
	changes = map[string]interface{}{
		"iddocSupport": false,
	}
	_, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oel.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	iddocQuestionnaire, err = IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.False(iddocQuestionnaire.Needed, "IDDOC questionnaire should not be needed when all conditions are unmet")
}
