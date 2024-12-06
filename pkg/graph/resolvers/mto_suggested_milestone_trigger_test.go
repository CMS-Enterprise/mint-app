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
// TODO We could refactor this to be more exhaustive (e.g. a test for each), and if we did this we'd probably want to do a more table-driven-testing approach,
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
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyManageCd, false)
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyUpdateContract, false)
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyRevColBids, false)

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
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyManageCd, true) // is now suggested!
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyUpdateContract, false)
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyRevColBids, false)
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
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyProcessPartAppeals, false) // Un-Answered, so the milestone is not suggested

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

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)                                                 // should only have 1
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyProcessPartAppeals, true) // true for any {appeal_performance,appeal_feedback,appeal_payments,appeal_other}

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

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)                                                 // should still only have 1
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyProcessPartAppeals, true) // Still suggested because the other appeal values are set to true, even though the only changed columsn are false

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
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyProcessPartAppeals, false) // Now, no composite column has  a true value, so it is not suggested
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
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyManageProvOverlap, false)

	changes["providerOverlap"] = string(models.OverlapNo) //not suggested
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 0)
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyManageProvOverlap, false)

	changes["providerOverlap"] = string(models.OverlapYesNeedPolicies) //suggested
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyManageProvOverlap, true)

	changes["providerOverlap"] = string(models.OverlapYesNoIssues) // still suggested with diff answer
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 1)
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyManageProvOverlap, true)

	//multi-select test
	changes["selectionMethod"] = []string{model.ParticipantSelectionTypeApplicationReviewAndScoringTool.String(), model.ParticipantSelectionTypeApplicationSupportContractor.String()}
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	suite.assertNumCommonMilestonesSuggested(commonMilestones, 3)
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyRevScoreApp, true)   // TRUE for {LOI,NOFO,APPLICATION_COLLECTION_TOOL} on column selection method
	suite.assertCommonMilestoneSuggestion(commonMilestones, models.MTOCommonMilestoneKeyAppSupportCon, true) //TRUE for {APPLICATION_SUPPORT_CONTRACTOR} on column selection method
}

// assertCommonMilestoneSuggestion is a helper method to help simplify tests that often are looking through a list of common milestones,
// finding a specific milestone from the list, and making sure that its `.isSuggested` property is what we expect it to be
func (suite *ResolverSuite) assertCommonMilestoneSuggestion(commonMilestones []*models.MTOCommonMilestone, keyToFind models.MTOCommonMilestoneKey, expectedSuggested bool) {
	milestone, _ := lo.Find(commonMilestones, func(cm *models.MTOCommonMilestone) bool {
		return cm.Key == keyToFind
	})

	if suite.NotNil(milestone) {
		suite.Equal(expectedSuggested, milestone.IsSuggested)
	}
}

// assertNumCommonMilestonesSuggested is a helper method used to assert the number of Common Milestones that have the `.isSuggested` property.
func (suite *ResolverSuite) assertNumCommonMilestonesSuggested(commonMilestones []*models.MTOCommonMilestone, expectedNumSuggested int) {
	actualNumSuggested := lo.CountBy(commonMilestones, func(cm *models.MTOCommonMilestone) bool {
		return cm.IsSuggested
	})

	suite.Equal(expectedNumSuggested, actualNumSuggested)
}
