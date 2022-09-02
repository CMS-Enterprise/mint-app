package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

// TestPlanITToolsUpdate tests PlanITToolsUpdate
func (suite *ResolverSuite) TestPlanITToolsUpdate() {
	plan := suite.createModelPlan("Plan for IT Tools")
	itExisting, err := PlanITToolsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	changes := map[string]interface{}{
		"gcPartCD":      []string{"OTHER", "MARX"},
		"gcPartCDOther": "My test tool",
	}

	it, err := PlanITToolsUpdate(suite.testConfigs.Logger, itExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	// Assert that the updated fields are right
	suite.EqualValues([]string{"OTHER", "MARX"}, it.GcPartCD)
	suite.EqualValues("My test tool", *it.GcPartCDOther)

	//Page 1
	// suite.Nil(it.GcPartCD)
	// suite.Nil(it.GcPartCDOther)
	suite.Nil(it.GcPartCDNote)
	suite.Nil(it.GcCollectBids)
	suite.Nil(it.GcCollectBidsOther)
	suite.Nil(it.GcCollectBidsNote)
	suite.Nil(it.GcUpdateContract)
	suite.Nil(it.GcUpdateContractOther)
	suite.Nil(it.GcUpdateContractNote)
	//Page 2
	suite.Nil(it.PpToAdvertise)
	suite.Nil(it.PpToAdvertiseOther)
	suite.Nil(it.PpToAdvertiseNote)
	suite.Nil(it.PpCollectScoreReview)
	suite.Nil(it.PpCollectScoreReviewOther)
	suite.Nil(it.PpCollectScoreReviewNote)
	suite.Nil(it.PpAppSupportContractor)
	suite.Nil(it.PpAppSupportContractorOther)
	suite.Nil(it.PpAppSupportContractorNote)
	//Page 3
	suite.Nil(it.PpCommunicateWithParticipant)
	suite.Nil(it.PpCommunicateWithParticipantOther)
	suite.Nil(it.PpCommunicateWithParticipantNote)
	suite.Nil(it.PpManageProviderOverlap)
	suite.Nil(it.PpManageProviderOverlapOther)
	suite.Nil(it.PpManageProviderOverlapNote)
	suite.Nil(it.BManageBeneficiaryOverlap)
	suite.Nil(it.BManageBeneficiaryOverlapOther)
	suite.Nil(it.BManageBeneficiaryOverlapNote)
	//Page 4
	suite.Nil(it.OelHelpdeskSupport)
	suite.Nil(it.OelHelpdeskSupportOther)
	suite.Nil(it.OelHelpdeskSupportNote)
	suite.Nil(it.OelManageAco)
	suite.Nil(it.OelManageAcoOther)
	suite.Nil(it.OelManageAcoNote)
	//Page 5
	suite.Nil(it.OelPerformanceBenchmark)
	suite.Nil(it.OelPerformanceBenchmarkOther)
	suite.Nil(it.OelPerformanceBenchmarkNote)
	suite.Nil(it.OelProcessAppeals)
	suite.Nil(it.OelProcessAppealsOther)
	suite.Nil(it.OelProcessAppealsNote)
	suite.Nil(it.OelEvaluationContractor)
	suite.Nil(it.OelEvaluationContractorOther)
	suite.Nil(it.OelEvaluationContractorNote)
	//Page 6
	suite.Nil(it.OelCollectData)
	suite.Nil(it.OelCollectDataOther)
	suite.Nil(it.OelCollectDataNote)
	suite.Nil(it.OelObtainData)
	suite.Nil(it.OelObtainDataOther)
	suite.Nil(it.OelObtainDataNote)
	suite.Nil(it.OelClaimsBasedMeasures)
	suite.Nil(it.OelClaimsBasedMeasuresOther)
	suite.Nil(it.OelClaimsBasedMeasuresNote)
	//Page 7
	suite.Nil(it.OelQualityScores)
	suite.Nil(it.OelQualityScoresOther)
	suite.Nil(it.OelQualityScoresNote)
	suite.Nil(it.OelSendReports)
	suite.Nil(it.OelSendReportsOther)
	suite.Nil(it.OelSendReportsNote)
	suite.Nil(it.OelLearningContractor)
	suite.Nil(it.OelLearningContractorOther)
	suite.Nil(it.OelLearningContractorNote)
	//Page 8
	suite.Nil(it.OelParticipantCollaboration)
	suite.Nil(it.OelParticipantCollaborationOther)
	suite.Nil(it.OelParticipantCollaborationNote)
	suite.Nil(it.OelEducateBeneficiaries)
	suite.Nil(it.OelEducateBeneficiariesOther)
	suite.Nil(it.OelEducateBeneficiariesNote)
	suite.Nil(it.PMakeClaimsPayments)
	suite.Nil(it.PMakeClaimsPaymentsOther)
	suite.Nil(it.PMakeClaimsPaymentsNote)
	//Page 9
	suite.Nil(it.PInformFfs)
	suite.Nil(it.PInformFfsOther)
	suite.Nil(it.PInformFfsNote)
	suite.Nil(it.PNonClaimsBasedPayments)
	suite.Nil(it.PNonClaimsBasedPaymentsOther)
	suite.Nil(it.PNonClaimsBasedPaymentsNote)
	suite.Nil(it.PSharedSavingsPlan)
	suite.Nil(it.PSharedSavingsPlanOther)
	suite.Nil(it.PSharedSavingsPlanNote)
	//Page 10
	suite.Nil(it.PRecoverPayments)
	suite.Nil(it.PRecoverPaymentsOther)
	suite.Nil(it.PRecoverPaymentsNote)

}

// TestPlanITToolsGetByModelPlanID tests PlanITToolsGetByModelPlanID
func (suite *ResolverSuite) TestPlanITToolsGetByModelPlanID() {

	plan := suite.createModelPlan("Plan for IT Tools")
	it, err := PlanITToolsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(plan.ID, it.ModelPlanID)
	suite.EqualValues(models.TaskReady, it.Status)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, it.CreatedBy)
	suite.Nil(it.ModifiedBy)

	//Page 1
	suite.Nil(it.GcPartCD)
	suite.Nil(it.GcPartCDOther)
	suite.Nil(it.GcPartCDNote)
	suite.Nil(it.GcCollectBids)
	suite.Nil(it.GcCollectBidsOther)
	suite.Nil(it.GcCollectBidsNote)
	suite.Nil(it.GcUpdateContract)
	suite.Nil(it.GcUpdateContractOther)
	suite.Nil(it.GcUpdateContractNote)
	//Page 2
	suite.Nil(it.PpToAdvertise)
	suite.Nil(it.PpToAdvertiseOther)
	suite.Nil(it.PpToAdvertiseNote)
	suite.Nil(it.PpCollectScoreReview)
	suite.Nil(it.PpCollectScoreReviewOther)
	suite.Nil(it.PpCollectScoreReviewNote)
	suite.Nil(it.PpAppSupportContractor)
	suite.Nil(it.PpAppSupportContractorOther)
	suite.Nil(it.PpAppSupportContractorNote)
	//Page 3
	suite.Nil(it.PpCommunicateWithParticipant)
	suite.Nil(it.PpCommunicateWithParticipantOther)
	suite.Nil(it.PpCommunicateWithParticipantNote)
	suite.Nil(it.PpManageProviderOverlap)
	suite.Nil(it.PpManageProviderOverlapOther)
	suite.Nil(it.PpManageProviderOverlapNote)
	suite.Nil(it.BManageBeneficiaryOverlap)
	suite.Nil(it.BManageBeneficiaryOverlapOther)
	suite.Nil(it.BManageBeneficiaryOverlapNote)
	//Page 4
	suite.Nil(it.OelHelpdeskSupport)
	suite.Nil(it.OelHelpdeskSupportOther)
	suite.Nil(it.OelHelpdeskSupportNote)
	suite.Nil(it.OelManageAco)
	suite.Nil(it.OelManageAcoOther)
	suite.Nil(it.OelManageAcoNote)
	//Page 5
	suite.Nil(it.OelPerformanceBenchmark)
	suite.Nil(it.OelPerformanceBenchmarkOther)
	suite.Nil(it.OelPerformanceBenchmarkNote)
	suite.Nil(it.OelProcessAppeals)
	suite.Nil(it.OelProcessAppealsOther)
	suite.Nil(it.OelProcessAppealsNote)
	suite.Nil(it.OelEvaluationContractor)
	suite.Nil(it.OelEvaluationContractorOther)
	suite.Nil(it.OelEvaluationContractorNote)
	//Page 6
	suite.Nil(it.OelCollectData)
	suite.Nil(it.OelCollectDataOther)
	suite.Nil(it.OelCollectDataNote)
	suite.Nil(it.OelObtainData)
	suite.Nil(it.OelObtainDataOther)
	suite.Nil(it.OelObtainDataNote)
	suite.Nil(it.OelClaimsBasedMeasures)
	suite.Nil(it.OelClaimsBasedMeasuresOther)
	suite.Nil(it.OelClaimsBasedMeasuresNote)
	//Page 7
	suite.Nil(it.OelQualityScores)
	suite.Nil(it.OelQualityScoresOther)
	suite.Nil(it.OelQualityScoresNote)
	suite.Nil(it.OelSendReports)
	suite.Nil(it.OelSendReportsOther)
	suite.Nil(it.OelSendReportsNote)
	suite.Nil(it.OelLearningContractor)
	suite.Nil(it.OelLearningContractorOther)
	suite.Nil(it.OelLearningContractorNote)
	//Page 8
	suite.Nil(it.OelParticipantCollaboration)
	suite.Nil(it.OelParticipantCollaborationOther)
	suite.Nil(it.OelParticipantCollaborationNote)
	suite.Nil(it.OelEducateBeneficiaries)
	suite.Nil(it.OelEducateBeneficiariesOther)
	suite.Nil(it.OelEducateBeneficiariesNote)
	suite.Nil(it.PMakeClaimsPayments)
	suite.Nil(it.PMakeClaimsPaymentsOther)
	suite.Nil(it.PMakeClaimsPaymentsNote)
	//Page 9
	suite.Nil(it.PInformFfs)
	suite.Nil(it.PInformFfsOther)
	suite.Nil(it.PInformFfsNote)
	suite.Nil(it.PNonClaimsBasedPayments)
	suite.Nil(it.PNonClaimsBasedPaymentsOther)
	suite.Nil(it.PNonClaimsBasedPaymentsNote)
	suite.Nil(it.PSharedSavingsPlan)
	suite.Nil(it.PSharedSavingsPlanOther)
	suite.Nil(it.PSharedSavingsPlanNote)
	//Page 10
	suite.Nil(it.PRecoverPayments)
	suite.Nil(it.PRecoverPaymentsOther)
	suite.Nil(it.PRecoverPaymentsNote)

}
