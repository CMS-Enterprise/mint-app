package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestPlanOpsEvalAndLearningUpdate tests PlanOpsEvalAndLearningUpdate
func (suite *ResolverSuite) TestPlanOpsEvalAndLearningUpdate() {

	plan := suite.createModelPlan("Plan for Ops Eval and Learning")

	oelExisting, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"stakeholdersNote":                   "These stakeholders might change",
		"helpdeskUse":                        false,
		"technicalContactsIdentified":        true,
		"technicalContactsIdentifiedDetail":  "Mrs. Robinson",
		"dataSharingFrequencyContinually":    "some test value for data sharing frequency",
		"dataCollectionFrequencyContinually": "some test value for data collection frequency",
	}

	oel, err := PlanOpsEvalAndLearningUpdate(suite.testConfigs.Logger, oelExisting.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	suite.EqualValues("some test value for data sharing frequency", *oel.DataSharingFrequencyContinually)
	suite.EqualValues("some test value for data collection frequency", *oel.DataCollectionFrequencyContinually)

	suite.Nil(oel.Stakeholders)
	suite.Nil(oel.StakeholdersOther)
	suite.Equal("These stakeholders might change", *oel.StakeholdersNote)
	suite.Equal(false, *oel.HelpdeskUse)
	suite.Nil(oel.HelpdeskUseNote)
	suite.Nil(oel.ContractorSupport)
	suite.Nil(oel.ContractorSupportOther)
	suite.Nil(oel.ContractorSupportHow)
	suite.Nil(oel.ContractorSupportNote)
	suite.Nil(oel.IddocSupport)
	suite.Nil(oel.IddocSupportNote)

	suite.Equal(true, *oel.TechnicalContactsIdentified)
	suite.Equal("Mrs. Robinson", *oel.TechnicalContactsIdentifiedDetail)
	suite.Nil(oel.TechnicalContactsIdentifiedNote)
	suite.Nil(oel.CaptureParticipantInfo)
	suite.Nil(oel.CaptureParticipantInfoNote)
	suite.Nil(oel.IcdOwner)
	suite.Nil(oel.DraftIcdDueDate)
	suite.Nil(oel.IcdNote)
	suite.Nil(oel.UatNeeds)
	suite.Nil(oel.StcNeeds)
	suite.Nil(oel.TestingTimelines)
	suite.Nil(oel.TestingNote)
	suite.Nil(oel.DataMonitoringFileTypes)
	suite.Nil(oel.DataMonitoringFileOther)
	suite.Nil(oel.DataResponseType)
	suite.Nil(oel.DataResponseFileFrequency)
	suite.Nil(oel.DataFullTimeOrIncremental)
	suite.Nil(oel.EftSetUp)
	suite.Nil(oel.UnsolicitedAdjustmentsIncluded)
	suite.Nil(oel.DataFlowDiagramsNeeded)
	suite.Nil(oel.ProduceBenefitEnhancementFiles)
	suite.Nil(oel.FileNamingConventions)
	suite.Nil(oel.DataMonitoringNote)
	suite.Nil(oel.BenchmarkForPerformance)
	suite.Nil(oel.BenchmarkForPerformanceNote)
	suite.Nil(oel.ComputePerformanceScores)
	suite.Nil(oel.ComputePerformanceScoresNote)
	suite.Nil(oel.RiskAdjustPerformance)
	suite.Nil(oel.RiskAdjustFeedback)
	suite.Nil(oel.RiskAdjustPayments)
	suite.Nil(oel.RiskAdjustOther)
	suite.Nil(oel.RiskAdjustNote)
	suite.Nil(oel.AppealPerformance)
	suite.Nil(oel.AppealFeedback)
	suite.Nil(oel.AppealPayments)
	suite.Nil(oel.AppealOther)
	suite.Nil(oel.AppealNote)
	suite.Nil(oel.EvaluationApproaches)
	suite.Nil(oel.EvaluationApproachOther)
	suite.Nil(oel.EvalutaionApproachNote)
	suite.Nil(oel.CcmInvolvment)
	suite.Nil(oel.CcmInvolvmentOther)
	suite.Nil(oel.CcmInvolvmentNote)
	suite.Nil(oel.DataNeededForMonitoring)
	suite.Nil(oel.DataNeededForMonitoringOther)
	suite.Nil(oel.DataNeededForMonitoringNote)
	suite.Nil(oel.DataToSendParticicipants)
	suite.Nil(oel.DataToSendParticicipantsOther)
	suite.Nil(oel.DataToSendParticicipantsNote)
	suite.Nil(oel.ShareCclfData)
	suite.Nil(oel.ShareCclfDataNote)
	suite.Nil(oel.SendFilesBetweenCcw)
	suite.Nil(oel.SendFilesBetweenCcwNote)
	suite.Nil(oel.AppToSendFilesToKnown)
	suite.Nil(oel.AppToSendFilesToWhich)
	suite.Nil(oel.AppToSendFilesToNote)
	suite.Nil(oel.UseCcwForFileDistribiutionToParticipants)
	suite.Nil(oel.UseCcwForFileDistribiutionToParticipantsNote)
	suite.Nil(oel.DevelopNewQualityMeasures)
	suite.Nil(oel.DevelopNewQualityMeasuresNote)
	suite.Nil(oel.QualityPerformanceImpactsPayment)
	suite.Nil(oel.QualityPerformanceImpactsPaymentOther)
	suite.Nil(oel.QualityPerformanceImpactsPaymentNote)
	suite.Nil(oel.DataSharingStarts)
	suite.Nil(oel.DataSharingStartsOther)
	suite.Nil(oel.DataSharingFrequency)
	suite.Nil(oel.DataSharingFrequencyOther)
	suite.Nil(oel.DataSharingStartsNote)
	suite.Nil(oel.DataCollectionStarts)
	suite.Nil(oel.DataCollectionStartsOther)
	suite.Nil(oel.DataCollectionFrequency)
	suite.Nil(oel.DataCollectionFrequencyOther)
	suite.Nil(oel.DataCollectionFrequencyNote)
	suite.Nil(oel.QualityReportingStarts)
	suite.Nil(oel.QualityReportingStartsOther)
	suite.Nil(oel.QualityReportingStartsNote)
	suite.Nil(oel.QualityReportingFrequency)
	suite.Nil(oel.QualityReportingFrequencyContinually)
	suite.Nil(oel.QualityReportingFrequencyOther)
	suite.Nil(oel.ModelLearningSystems)
	suite.Nil(oel.ModelLearningSystemsOther)
	suite.Nil(oel.ModelLearningSystemsNote)
	suite.Nil(oel.AnticipatedChallenges)
}

// TestPlanOpsEvalAndLearningGetByModelPlanID tests PlanOpsEvalAndLearningGetByModelPlanID
func (suite *ResolverSuite) TestPlanOpsEvalAndLearningGetByModelPlanID() {
	plan := suite.createModelPlan("Plan for Ops Eval and Learning")
	oel, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	suite.EqualValues(plan.ID, oel.ModelPlanID)
	suite.EqualValues(models.TaskReady, oel.Status)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, oel.CreatedBy)
	suite.Nil(oel.ModifiedBy)

	//Assert these fields are nil upon creation
	suite.Nil(oel.Stakeholders)
	suite.Nil(oel.StakeholdersOther)
	suite.Nil(oel.StakeholdersNote)
	suite.Nil(oel.HelpdeskUse)
	suite.Nil(oel.HelpdeskUseNote)
	suite.Nil(oel.ContractorSupport)
	suite.Nil(oel.ContractorSupportOther)
	suite.Nil(oel.ContractorSupportHow)
	suite.Nil(oel.ContractorSupportNote)
	suite.Nil(oel.IddocSupport)
	suite.Nil(oel.IddocSupportNote)
	suite.Nil(oel.TechnicalContactsIdentified)
	suite.Nil(oel.TechnicalContactsIdentifiedDetail)
	suite.Nil(oel.TechnicalContactsIdentifiedNote)
	suite.Nil(oel.CaptureParticipantInfo)
	suite.Nil(oel.CaptureParticipantInfoNote)
	suite.Nil(oel.IcdOwner)
	suite.Nil(oel.DraftIcdDueDate)
	suite.Nil(oel.IcdNote)
	suite.Nil(oel.UatNeeds)
	suite.Nil(oel.StcNeeds)
	suite.Nil(oel.TestingTimelines)
	suite.Nil(oel.TestingNote)
	suite.Nil(oel.DataMonitoringFileTypes)
	suite.Nil(oel.DataMonitoringFileOther)
	suite.Nil(oel.DataResponseType)
	suite.Nil(oel.DataResponseFileFrequency)
	suite.Nil(oel.DataFullTimeOrIncremental)
	suite.Nil(oel.EftSetUp)
	suite.Nil(oel.UnsolicitedAdjustmentsIncluded)
	suite.Nil(oel.DataFlowDiagramsNeeded)
	suite.Nil(oel.ProduceBenefitEnhancementFiles)
	suite.Nil(oel.FileNamingConventions)
	suite.Nil(oel.DataMonitoringNote)
	suite.Nil(oel.BenchmarkForPerformance)
	suite.Nil(oel.BenchmarkForPerformanceNote)
	suite.Nil(oel.ComputePerformanceScores)
	suite.Nil(oel.ComputePerformanceScoresNote)
	suite.Nil(oel.RiskAdjustPerformance)
	suite.Nil(oel.RiskAdjustFeedback)
	suite.Nil(oel.RiskAdjustPayments)
	suite.Nil(oel.RiskAdjustOther)
	suite.Nil(oel.RiskAdjustNote)
	suite.Nil(oel.AppealPerformance)
	suite.Nil(oel.AppealFeedback)
	suite.Nil(oel.AppealPayments)
	suite.Nil(oel.AppealOther)
	suite.Nil(oel.AppealNote)
	suite.Nil(oel.EvaluationApproaches)
	suite.Nil(oel.EvaluationApproachOther)
	suite.Nil(oel.EvalutaionApproachNote)
	suite.Nil(oel.CcmInvolvment)
	suite.Nil(oel.CcmInvolvmentOther)
	suite.Nil(oel.CcmInvolvmentNote)
	suite.Nil(oel.DataNeededForMonitoring)
	suite.Nil(oel.DataNeededForMonitoringOther)
	suite.Nil(oel.DataNeededForMonitoringNote)
	suite.Nil(oel.DataToSendParticicipants)
	suite.Nil(oel.DataToSendParticicipantsOther)
	suite.Nil(oel.DataToSendParticicipantsNote)
	suite.Nil(oel.ShareCclfData)
	suite.Nil(oel.ShareCclfDataNote)
	suite.Nil(oel.SendFilesBetweenCcw)
	suite.Nil(oel.SendFilesBetweenCcwNote)
	suite.Nil(oel.AppToSendFilesToKnown)
	suite.Nil(oel.AppToSendFilesToWhich)
	suite.Nil(oel.AppToSendFilesToNote)
	suite.Nil(oel.UseCcwForFileDistribiutionToParticipants)
	suite.Nil(oel.UseCcwForFileDistribiutionToParticipantsNote)
	suite.Nil(oel.DevelopNewQualityMeasures)
	suite.Nil(oel.DevelopNewQualityMeasuresNote)
	suite.Nil(oel.QualityPerformanceImpactsPayment)
	suite.Nil(oel.QualityPerformanceImpactsPaymentOther)
	suite.Nil(oel.QualityPerformanceImpactsPaymentNote)
	suite.Nil(oel.DataSharingStarts)
	suite.Nil(oel.DataSharingStartsOther)
	suite.Nil(oel.DataSharingFrequency)
	suite.Nil(oel.DataSharingFrequencyOther)
	suite.Nil(oel.DataSharingStartsNote)
	suite.Nil(oel.DataCollectionStarts)
	suite.Nil(oel.DataCollectionStartsOther)
	suite.Nil(oel.DataCollectionFrequency)
	suite.Nil(oel.DataCollectionFrequencyOther)
	suite.Nil(oel.DataCollectionFrequencyNote)
	suite.Nil(oel.QualityReportingStarts)
	suite.Nil(oel.QualityReportingStartsOther)
	suite.Nil(oel.QualityReportingStartsNote)
	suite.Nil(oel.QualityReportingFrequency)
	suite.Nil(oel.QualityReportingFrequencyContinually)
	suite.Nil(oel.QualityReportingFrequencyOther)
	suite.Nil(oel.ModelLearningSystems)
	suite.Nil(oel.ModelLearningSystemsOther)
	suite.Nil(oel.ModelLearningSystemsNote)
	suite.Nil(oel.AnticipatedChallenges)

}
