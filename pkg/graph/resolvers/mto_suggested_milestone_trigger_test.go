package resolvers

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

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
	manageCD := findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyManageCd)

	if suite.NotNil(manageCD) {
		// There is no entry for this in the suggested milestone table.
		suite.False(manageCD.IsSuggested)
	}

	updateContract := findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyUpdateContract)
	if suite.NotNil(updateContract) {
		suite.False(updateContract.IsSuggested)
	}
	revColBids := findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyRevColBids)
	if suite.NotNil(revColBids) {
		suite.False(revColBids.IsSuggested)
	}

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

	manageCD = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyManageCd)
	updateContract = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyUpdateContract)
	revColBids = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyRevColBids)

	suite.True(manageCD.IsSuggested)
	suite.False(updateContract.IsSuggested)
	suite.False(revColBids.IsSuggested)

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

	processPart := findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyProcessPartAppeals)
	suite.NotNil(processPart)
	suite.False(processPart.IsSuggested) // Un-Answered, so the milestone is not suggested

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

	processPart = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyProcessPartAppeals) // true for any {appeal_performance,appeal_feedback,appeal_payments,appeal_other}
	suite.NotNil(processPart)
	suite.True(processPart.IsSuggested)

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

	processPart = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyProcessPartAppeals)
	suite.NotNil(processPart)
	suite.True(processPart.IsSuggested) // Still suggested because the other appeal values are set to true, even though the only changed columsn are false

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

	processPart = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyProcessPartAppeals)
	suite.NotNil(processPart)
	suite.False(processPart.IsSuggested) // Now, no composite column has  a true value, so it is not suggested

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

	manageProvOverlap := findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyManageProvOverlap)
	suite.NotNil(manageProvOverlap)
	suite.False(manageProvOverlap.IsSuggested)

	changes["providerOverlap"] = string(models.OverlapNo) //not suggested
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageProvOverlap = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyManageProvOverlap)
	suite.NotNil(manageProvOverlap)
	suite.False(manageProvOverlap.IsSuggested)

	changes["providerOverlap"] = string(models.OverlapYesNeedPolicies) //suggested
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageProvOverlap = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyManageProvOverlap)
	suite.NotNil(manageProvOverlap)
	suite.True(manageProvOverlap.IsSuggested)

	changes["providerOverlap"] = string(models.OverlapYesNoIssues) // still suggested with diff answer
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageProvOverlap = findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyManageProvOverlap)
	suite.NotNil(manageProvOverlap)
	suite.True(manageProvOverlap.IsSuggested)

	//multi-select test
	changes["selectionMethod"] = []string{model.ParticipantSelectionTypeApplicationReviewAndScoringTool.String(), model.ParticipantSelectionTypeApplicationSupportContractor.String()}
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	commonMilestones, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)
	revScoreApp := findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyRevScoreApp) // TRUE for {LOI,NOFO,APPLICATION_COLLECTION_TOOL} on column selection method
	suite.NotNil(revScoreApp)
	appSuppCont := findCommonMilestone(commonMilestones, models.MTOCommonMilestoneKeyAppSupportCon) //TRUE for {APPLICATION_SUPPORT_CONTRACTOR} on column selection method
	suite.NotNil(appSuppCont)

	suite.True(revScoreApp.IsSuggested)
	suite.True(appSuppCont.IsSuggested)

}

func findCommonMilestone(collection []*models.MTOCommonMilestone, key models.MTOCommonMilestoneKey) *models.MTOCommonMilestone {
	milestone, _ := lo.Find[*models.MTOCommonMilestone](collection, func(cm *models.MTOCommonMilestone) bool {
		return cm.Key == key
	})
	return milestone
}
