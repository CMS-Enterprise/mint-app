package resolvers

import (
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestGeneralCharacteristicsSuggestions() {
	plan := suite.createModelPlan("plan for need")

	gc, err := PlanGeneralCharacteristicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"managePartCDEnrollment": false, // NEED 1, MANAGE_CD
		// "collectPlanBids":        true, // NEED 2, MANAGE_CD
		// "planContractUpdated":        false, // NEED 3 UPDATE_CONTRACT
	}
	updatedGeneralCharacteristics, err := UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedGeneralCharacteristics.ModifiedBy)

	opNeeds, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NotNil(opNeeds)
	suite.NoError(err)
	manageCD := findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyManageCd)

	if suite.NotNil(manageCD) {
		suite.False(manageCD.IsSuggested)
	}

	updateContract := findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyUpdateContract)
	suite.NotNil(updateContract)
	revColBids := findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyRevColBids)
	suite.NotNil(revColBids)

	suite.Nil(updateContract.IsSuggested)
	suite.Nil(revColBids.IsSuggested)

	changes = map[string]interface{}{
		"managePartCDEnrollment": true,  // NEED 1, MANAGE_CD
		"collectPlanBids":        false, // NEED 2, MANAGE_CD
		"planContractUpdated":    false, // NEED 3 UPDATE_CONTRACT
	}

	updatedGeneralCharacteristics, err = UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedGeneralCharacteristics.ModifiedBy)

	opNeeds, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageCD = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyManageCd)
	updateContract = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyUpdateContract)
	revColBids = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyRevColBids)

	suite.True(manageCD.IsSuggested)
	suite.False(updateContract.IsSuggested)
	suite.False(revColBids.IsSuggested)

}
func (suite *ResolverSuite) TestCompositeColumnSuggestionTrigger() {
	plan := suite.createModelPlan("plan for complex need")

	oelExisting, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(oelExisting)

	changes := map[string]interface{}{ // NEED 13, PROCESS_PART_APPEALS

		"appealNote": "we are testing appeal statements",
	}

	oel, err := PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)
	opNeeds, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	processPart := findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyProcessPartAppeals)
	suite.NotNil(processPart)
	suite.Nil(processPart.IsSuggested) // Un-Answered

	changes = map[string]interface{}{
		"appealFeedback": true,
		// "appealPayments": false,
		// "appealOther":    false,
		"appealPerformance": true,
	}

	oel, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)

	opNeeds, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	processPart = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyProcessPartAppeals) // true for any {appeal_performance,appeal_feedback,appeal_payments,appeal_other}
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

	opNeeds, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	processPart = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyProcessPartAppeals)
	suite.NotNil(processPart)
	suite.True(processPart.IsSuggested) // Still needed because the other appeal values are set to true, even though the only changed columsn are false

	changes = map[string]interface{}{
		"appealFeedback": false,
		// "appealPayments": false,
		// "appealOther":    false,
		"appealPerformance": false,
	}
	oel, err = PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(oel)
	suite.NoError(err)

	opNeeds, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	processPart = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyProcessPartAppeals)
	suite.NotNil(processPart)
	suite.False(processPart.IsSuggested) // Now, no composite column has  a true value, so it is not needed

}

func (suite *ResolverSuite) TestSelectionTypeSuggestionTrigger() {
	plan := suite.createModelPlan("plan for selection need")

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

	opNeeds, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageProvOverlap := findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyManageProvOverlap)
	suite.NotNil(manageProvOverlap)
	suite.Nil(manageProvOverlap.IsSuggested)

	changes["providerOverlap"] = string(models.OverlapNo) //not needed
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	opNeeds, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageProvOverlap = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyManageProvOverlap)
	suite.NotNil(manageProvOverlap)
	suite.False(manageProvOverlap.IsSuggested)

	changes["providerOverlap"] = string(models.OverlapYesNeedPolicies) //needed
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	opNeeds, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageProvOverlap = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyManageProvOverlap)
	suite.NotNil(manageProvOverlap)
	suite.True(manageProvOverlap.IsSuggested)

	changes["providerOverlap"] = string(models.OverlapYesNoIssues) // still needed with diff answer
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	opNeeds, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)

	manageProvOverlap = findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyManageProvOverlap)
	suite.NotNil(manageProvOverlap)
	suite.True(manageProvOverlap.IsSuggested)

	//multi-select test
	changes["selectionMethod"] = []string{model.ParticipantSelectionTypeApplicationReviewAndScoringTool.String(), model.ParticipantSelectionTypeApplicationSupportContractor.String()}
	updatedPP, err = PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NotNil(updatedPP)
	suite.NoError(err)

	opNeeds, err = MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)
	revScoreApp := findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyRevScoreApp) // TRUE for {LOI,NOFO,APPLICATION_COLLECTION_TOOL} on column selection method
	suite.NotNil(revScoreApp)
	appSuppCont := findCommonMilestone(opNeeds, models.MTOCommonMilestoneKeyAppSupportCon) //TRUE for {APPLICATION_SUPPORT_CONTRACTOR} on column selection method
	suite.NotNil(appSuppCont)

	suite.True(revScoreApp.IsSuggested)
	suite.True(appSuppCont.IsSuggested)

}

func findCommonMilestone(collection []*models.MTOCommonMilestone, key models.MTOCommonMilestoneKey) *models.MTOCommonMilestone {
	milestone, _ := lo.Find[*models.MTOCommonMilestone](collection, func(cm *models.MTOCommonMilestone) bool {
		return cm.Key == key
	})
	return milestone

	// for i := 0; i < len(collection); i++ {
	// 	if reflect.DeepEqual(collection[i].Key, &key) {
	// 		return collection[i]
	// 	}
	// }
	// return nil

}
