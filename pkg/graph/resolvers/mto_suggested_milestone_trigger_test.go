package resolvers

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// Currently, these tests do not exhaustively validate _every_ possible trigger for suggested common milestones.
// It mainly focuses on testing the different types/styles of answers that can cause a milestone to become suggested.
//
// Future Enhancement We could refactor this to be more exhaustive (e.g. a test for each), and if we did this we'd probably want to do a more table-driven-testing approach,
// but it's probably just not worth it at this time.

func (suite *ResolverSuite) TestGeneralCharacteristicsSuggestions() {
	planID := uuid.MustParse("fd4b089f-b608-4b58-bb1b-074573f39c65")
	plan := suite.createModelPlanWithID("plan for milestone suggestions", &planID)

	gc, err := PlanGeneralCharacteristicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"managePartCDEnrollment": false, // Milestone 1, MANAGE_CD
		// "collectPlanBids":        true, // Milestone 2, MANAGE_CD
		// "planContractUpdated":        false, // Milestone 3 UPDATE_CONTRACT
	}
	updatedGeneralCharacteristics, err := UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedGeneralCharacteristics.ModifiedBy)

	commonMilestones, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NotNil(commonMilestones)
	suite.NoError(err)

	// Check the suggestion status of a few common milestones
	// No changes have been made yet that would cause a milestone to be created
	suite.assertNumCommonMilestonesSuggested(commonMilestones, 0) // there shouldn't be any suggested milestones prior to any changes that would create them
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Manage Part C/D enrollment", false)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Update the plan’s contract", false)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Review and collect plan bids", false)

	changes = map[string]interface{}{
		"managePartCDEnrollment": true,  // Milestone 1, MANAGE_CD
		"collectPlanBids":        false, // Milestone 2, MANAGE_CD
		"planContractUpdated":    false, // Milestone 3 UPDATE_CONTRACT
	}

	updatedGeneralCharacteristics, err = UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedGeneralCharacteristics.ModifiedBy)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Manage Part C/D enrollment", true) // is now suggested!
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Update the plan’s contract", false)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Review and collect plan bids", false)
}
func (suite *ResolverSuite) TestCompositeColumnSuggestionTrigger() {
	plan := suite.createModelPlan("plan for complex milestone suggestion logic")

	oelExisting, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(oelExisting)

	changes := map[string]interface{}{ // Milestone 13, PROCESS_PART_APPEALS

		"appealNote": "we are testing appeal statements",
	}

	oel, err := PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)
	commonMilestones, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	// We shouldn't have any suggested milestones just yet
	suite.assertNumCommonMilestonesSuggested(commonMilestones, 0)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Process participant appeals", false) // Un-Answered, so the milestone is not suggested

	changes = map[string]interface{}{
		"appealFeedback": true,
		// "appealPayments": false,
		// "appealOther":    false,
		"appealPerformance": true,
	}

	oel, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)                                // should only have 1
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Process participant appeals", true) // true for any {appeal_performance,appeal_feedback,appeal_payments,appeal_other}

	// Change some other appeal-related answers, but still leaving the `appealFeedback` and `appealPerformance` answered (as true -- so this shouldn't undo the suggestion yet!)
	changes = map[string]interface{}{
		// "appealFeedback": true,
		"appealPayments": false,
		"appealOther":    false,
		// "appealPerformance": true,
	}
	oel, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)                                // should still only have 1
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Process participant appeals", true) // Still suggested because the other appeal values are set to true, even though the only changed columsn are false

	// Finally, undo the initial answers that suggested this milestone in the first place
	changes = map[string]interface{}{
		"appealFeedback": false,
		// "appealPayments": false,
		// "appealOther":    false,
		"appealPerformance": false,
	}
	oel, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 0)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Process participant appeals", false) // Now, no composite column has  a true value, so it is not suggested
}

func (suite *ResolverSuite) TestSelectionTypeSuggestionTrigger() {
	plan := suite.createModelPlan("plan for selection milestone suggestion")

	pp, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"confidenceNote":     "This is a confidence note",
		"recruitmentNote":    "This is a recruitment note",
		"estimateConfidence": string(models.ConfidenceSlightly),
	}

	updatedPP, err := PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 0)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Manage and check provider overlaps", false)

	changes["providerOverlap"] = string(models.OverlapNo) //not suggested
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 0)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Manage and check provider overlaps", false)

	changes["providerOverlap"] = string(models.OverlapYesNeedPolicies) //suggested
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Manage and check provider overlaps", true)

	changes["providerOverlap"] = string(models.OverlapYesNoIssues) // still suggested with diff answer
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Manage and check provider overlaps", true)

	//multi-select test
	changes["selectionMethod"] = []string{model.ParticipantSelectionTypeApplicationReviewAndScoringTool.String(), model.ParticipantSelectionTypeApplicationSupportContractor.String()}
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 3)
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Review and score applications", true)             // TRUE for {LOI,NOFO,APPLICATION_COLLECTION_TOOL} on column selection method
	suite.assertCommonMilestoneSuggestion(commonMilestones, "Acquire an application support contractor", true) //TRUE for {APPLICATION_SUPPORT_CONTRACTOR} on column selection method
}

// TestSuggestedMilestoneReasons verifies that when a milestone becomes suggested,
// the correct per-field reason rows are written to mto_suggested_milestone_reason.
// It covers the three trigger styles used in the codebase:
//   - Boolean:    a single true/false column
//   - Selection:  a single enum column whose value matches one of the trigger values
//   - Composite:  multiple columns, each producing a separate reason row
func (suite *ResolverSuite) TestSuggestedMilestoneReasons() {
	// --- 1. Boolean trigger: managePartCDEnrollment → plan_general_characteristics ---
	plan := suite.createModelPlan("plan for suggested milestone reasons - boolean")

	gc, err := PlanGeneralCharacteristicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	_, err = UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID,
		map[string]interface{}{"managePartCDEnrollment": true},
		suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	commonMilestones, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageCDMilestone, found := lo.Find(commonMilestones, func(cm *models.MTOCommonMilestone) bool {
		return cm.Name == "Manage Part C/D enrollment"
	})
	suite.True(found)
	suite.Require().NotNil(manageCDMilestone.MTOSuggestedMilestoneID)

	reasons, err := MTOSuggestedMilestoneReasonGetByIDLOADER(suite.testConfigs.Context, *manageCDMilestone.MTOSuggestedMilestoneID)
	suite.NoError(err)
	suite.Len(reasons, 1)
	suite.Equal(models.MilestoneSuggestionReasonTablePlanGeneralCharacteristics, reasons[0].TriggerTable)
	suite.Equal("manage_part_c_d_enrollment", reasons[0].TriggerCol)
	suite.Equal("t", reasons[0].TriggerVal)

	// --- 2. Selection trigger: providerOverlap → plan_participants_and_providers ---
	plan2 := suite.createModelPlan("plan for suggested milestone reasons - selection")

	pp, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(suite.testConfigs.Context, plan2.ID)
	suite.NoError(err)

	_, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID,
		map[string]interface{}{"providerOverlap": string(models.OverlapYesNeedPolicies)},
		suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	commonMilestones2, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan2.ID)
	suite.NoError(err)

	overlapMilestone, found := lo.Find(commonMilestones2, func(cm *models.MTOCommonMilestone) bool {
		return cm.Name == "Manage and check provider overlaps"
	})
	suite.True(found)
	suite.Require().NotNil(overlapMilestone.MTOSuggestedMilestoneID)

	reasons2, err := MTOSuggestedMilestoneReasonGetByIDLOADER(suite.testConfigs.Context, *overlapMilestone.MTOSuggestedMilestoneID)
	suite.NoError(err)
	suite.Len(reasons2, 1)
	suite.Equal(models.MilestoneSuggestionReasonTablePlanParticipantsAndProviders, reasons2[0].TriggerTable)
	suite.Equal("provider_overlap", reasons2[0].TriggerCol)
	suite.Equal(string(models.OverlapYesNeedPolicies), reasons2[0].TriggerVal)

	// --- 3. Composite trigger: multiple appeal columns → multiple reason rows ---
	plan3 := suite.createModelPlan("plan for suggested milestone reasons - composite")

	oel, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan3.ID)
	suite.NoError(err)

	_, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oel.ID,
		map[string]interface{}{"appealFeedback": true, "appealPerformance": true},
		suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	commonMilestones3, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan3.ID)
	suite.NoError(err)

	appealMilestone, found := lo.Find(commonMilestones3, func(cm *models.MTOCommonMilestone) bool {
		return cm.Name == "Process participant appeals"
	})
	suite.True(found)
	suite.Require().NotNil(appealMilestone.MTOSuggestedMilestoneID)

	reasons3, err := MTOSuggestedMilestoneReasonGetByIDLOADER(suite.testConfigs.Context, *appealMilestone.MTOSuggestedMilestoneID)
	suite.NoError(err)
	suite.Len(reasons3, 2)

	cols := lo.Map(reasons3, func(r *models.MTOSuggestedMilestoneReason, _ int) string { return r.TriggerCol })
	suite.ElementsMatch([]string{"appeal_feedback", "appeal_performance"}, cols)
	for _, reason := range reasons3 {
		suite.Equal(models.MilestoneSuggestionReasonTablePlanOpsEvalAndLearning, reason.TriggerTable)
		suite.Equal("t", reason.TriggerVal)
	}
}

// assertCommonMilestoneSuggestion is a helper method to help simplify tests that often are looking through a list of common milestones,
// finding a specific milestone from the list, and making sure that its suggestion state is what we expect it to be.
// A milestone is considered suggested when MTOSuggestedMilestoneID is non-nil.
func (suite *ResolverSuite) assertCommonMilestoneSuggestion(commonMilestones []*models.MTOCommonMilestone, nameToFind string, expectedSuggested bool) {
	milestone, _ := lo.Find(commonMilestones, func(cm *models.MTOCommonMilestone) bool {
		return cm.Name == nameToFind
	})

	if suite.NotNil(milestone) {
		isSuggested := milestone.MTOSuggestedMilestoneID != nil
		suite.Equal(expectedSuggested, isSuggested)
	}
}

// assertNumCommonMilestonesSuggested is a helper method used to assert the number of Common Milestones that are currently suggested.
// A milestone is considered suggested when MTOSuggestedMilestoneID is non-nil.
func (suite *ResolverSuite) assertNumCommonMilestonesSuggested(commonMilestones []*models.MTOCommonMilestone, expectedNumSuggested int) {
	actualNumSuggested := lo.CountBy(commonMilestones, func(cm *models.MTOCommonMilestone) bool {
		return cm.MTOSuggestedMilestoneID != nil
	})

	suite.Equal(expectedNumSuggested, actualNumSuggested)
}
