package models

import (
	"time"

	"github.com/lib/pq"
)

// PlanOpsEvalAndLearning represents the tasks list section that handles information around operations, evaluation, and learning
type PlanOpsEvalAndLearning struct {
	baseTaskListSection

	//Page 1
	Stakeholders           pq.StringArray `json:"stakeholders" db:"stakeholders"`
	StakeholdersOther      *string        `json:"stakeholdersOther" db:"stakeholders_other"`
	StakeholdersNote       *string        `json:"stakeholdersNote" db:"stakeholders_note"`
	HelpdeskUse            *bool          `json:"helpdeskUse" db:"helpdesk_use"`
	HelpdeskUseNote        *string        `json:"helpdeskUseNote" db:"helpdesk_use_note"`
	ContractorSupport      pq.StringArray `json:"contractorSupport" db:"contractor_support"`
	ContractorSupportOther *string        `json:"contractorSupportOther" db:"contractor_support_other"`
	ContractorSupportHow   *string        `json:"contractorSupportHow" db:"contractor_support_how"`
	ContractorSupportNote  *string        `json:"contractorSupportNote" db:"contractor_support_note"`
	// IddocSupport has a database trigger (sync_iddoc_on_oel_update) that automatically updates
	// iddoc_questionnaire.needed when this field changes. See V254__Add_IDDOC_Triggers.sql
	IddocSupport     *bool   `json:"iddocSupport" db:"iddoc_support" statusWeight:"1"`
	IddocSupportNote *string `json:"iddocSupportNote" db:"iddoc_support_note"`

	//Page 2 (optional based on IddocSupport = true)
	TechnicalContactsIdentified       *bool      `json:"technicalContactsIdentified" db:"technical_contacts_identified"`
	TechnicalContactsIdentifiedDetail *string    `json:"technicalContactsIdentifiedDetail" db:"technical_contacts_identified_detail"`
	TechnicalContactsIdentifiedNote   *string    `json:"technicalContactsIdentifiedNote" db:"technical_contacts_identified_note"`
	CaptureParticipantInfo            *bool      `json:"captureParticipantInfo" db:"capture_participant_info"`
	CaptureParticipantInfoNote        *string    `json:"captureParticipantInfoNote" db:"capture_participant_info_note"`
	IcdOwner                          *string    `json:"icdOwner" db:"icd_owner"`
	DraftIcdDueDate                   *time.Time `json:"draftIcdDueDate" db:"draft_icd_due_date"`
	IcdNote                           *string    `json:"icdNote" db:"icd_note"`

	//Page 3 (optional based on IddocSupport = true)
	UatNeeds                  *string        `json:"uatNeeds" db:"uat_needs"`
	StcNeeds                  *string        `json:"stcNeeds" db:"stc_needs"`
	TestingTimelines          *string        `json:"testingTimelines" db:"testing_timelines"`
	TestingNote               *string        `json:"testingNote" db:"testing_note"`
	DataMonitoringFileTypes   pq.StringArray `json:"dataMonitoringFileTypes" db:"data_monitoring_file_types"`
	DataMonitoringFileOther   *string        `json:"dataMonitoringFileOther" db:"data_monitoring_file_other"`
	DataResponseType          *string        `json:"dataResponseType" db:"data_response_type"`
	DataResponseFileFrequency *string        `json:"dataResponseFileFrequency" db:"data_response_file_frequency"`

	//Page 4 (optional based on IddocSupport = true)
	DataFullTimeOrIncremental      *DataFullTimeOrIncrementalType `json:"dataFullTimeOrIncremental" db:"data_full_time_or_incremental"`
	EftSetUp                       *bool                          `json:"eftSetUp" db:"eft_set_up"`
	UnsolicitedAdjustmentsIncluded *bool                          `json:"unsolicitedAdjustmentsIncluded" db:"unsolicited_adjustments_included"`
	DataFlowDiagramsNeeded         *bool                          `json:"dataFlowDiagramsNeeded" db:"data_flow_diagrams_needed"`
	ProduceBenefitEnhancementFiles *bool                          `json:"produceBenefitEnhancementFiles" db:"produce_benefit_enhancement_files"`
	FileNamingConventions          *string                        `json:"fileNamingConventions" db:"file_naming_conventions"`
	DataMonitoringNote             *string                        `json:"dataMonitoringNote" db:"data_monitoring_note"`

	//Page 5
	BenchmarkForPerformance      *BenchmarkForPerformanceType `json:"benchmarkForPerformance" db:"benchmark_for_performance" statusWeight:"1"`
	BenchmarkForPerformanceNote  *string                      `json:"benchmarkForPerformanceNote" db:"benchmark_for_performance_note"`
	ComputePerformanceScores     *bool                        `json:"computePerformanceScores" db:"compute_performance_scores" statusWeight:"1"`
	ComputePerformanceScoresNote *string                      `json:"computePerformanceScoresNote" db:"compute_performance_scores_note"`
	RiskAdjustPerformance        *bool                        `json:"riskAdjustPerformance" db:"risk_adjust_performance" statusWeight:"1"`
	RiskAdjustFeedback           *bool                        `json:"riskAdjustFeedback" db:"risk_adjust_feedback" statusWeight:"1"`
	RiskAdjustPayments           *bool                        `json:"riskAdjustPayments" db:"risk_adjust_payments" statusWeight:"1"`
	RiskAdjustOther              *bool                        `json:"riskAdjustOther" db:"risk_adjust_other"`
	RiskAdjustNote               *string                      `json:"riskAdjustNote" db:"risk_adjust_note"`
	AppealPerformance            *bool                        `json:"appealPerformance" db:"appeal_performance" statusWeight:"1"`
	AppealFeedback               *bool                        `json:"appealFeedback" db:"appeal_feedback" statusWeight:"1"`
	AppealPayments               *bool                        `json:"appealPayments" db:"appeal_payments" statusWeight:"1"`
	AppealOther                  *bool                        `json:"appealOther" db:"appeal_other"`
	AppealNote                   *string                      `json:"appealNote" db:"appeal_note"`

	//Page 6
	EvaluationApproaches          pq.StringArray `json:"evaluationApproaches" db:"evaluation_approaches"`
	EvaluationApproachOther       *string        `json:"evaluationApproachOther" db:"evaluation_approach_other"`
	EvaluationApproachNote        *string        `json:"evaluationApproachNote" db:"evaluation_approach_note"`
	CcmInvolvment                 pq.StringArray `json:"ccmInvolvment" db:"ccm_involvment"`
	CcmInvolvmentOther            *string        `json:"ccmInvolvmentOther" db:"ccm_involvment_other"`
	CcmInvolvmentNote             *string        `json:"ccmInvolvmentNote" db:"ccm_involvment_note"`
	DataNeededForMonitoring       pq.StringArray `json:"dataNeededForMonitoring" db:"data_needed_for_monitoring"`
	DataNeededForMonitoringOther  *string        `json:"dataNeededForMonitoringOther" db:"data_needed_for_monitoring_other"`
	DataNeededForMonitoringNote   *string        `json:"dataNeededForMonitoringNote" db:"data_needed_for_monitoring_note"`
	DataToSendParticicipants      pq.StringArray `json:"dataToSendParticicipants" db:"data_to_send_particicipants"`
	DataToSendParticicipantsOther *string        `json:"dataToSendParticicipantsOther" db:"data_to_send_particicipants_other"`
	DataToSendParticicipantsNote  *string        `json:"dataToSendParticicipantsNote" db:"data_to_send_particicipants_note"`
	ShareCclfData                 *bool          `json:"shareCclfData" db:"share_cclf_data" statusWeight:"1"`
	ShareCclfDataNote             *string        `json:"shareCclfDataNote" db:"share_cclf_data_note"`

	//Page 7
	SendFilesBetweenCcw                          *bool           `json:"sendFilesBetweenCcw" db:"send_files_between_ccw" statusWeight:"1"`
	SendFilesBetweenCcwNote                      *string         `json:"sendFilesBetweenCcwNote" db:"send_files_between_ccw_note"`
	AppToSendFilesToKnown                        *bool           `json:"appToSendFilesToKnown" db:"app_to_send_files_to_known" statusWeight:"1"`
	AppToSendFilesToWhich                        *string         `json:"appToSendFilesToWhich" db:"app_to_send_files_to_which"`
	AppToSendFilesToNote                         *string         `json:"appToSendFilesToNote" db:"app_to_send_files_to_note"`
	UseCcwForFileDistribiutionToParticipants     *bool           `json:"useCcwForFileDistribiutionToParticipants" db:"use_ccw_for_file_distribiution_to_participants" statusWeight:"1"`
	UseCcwForFileDistribiutionToParticipantsNote *string         `json:"useCcwForFileDistribiutionToParticipantsNote" db:"use_ccw_for_file_distribiution_to_participants_note"`
	DevelopNewQualityMeasures                    *bool           `json:"developNewQualityMeasures" db:"develop_new_quality_measures" statusWeight:"1"`
	DevelopNewQualityMeasuresNote                *string         `json:"developNewQualityMeasuresNote" db:"develop_new_quality_measures_note"`
	QualityPerformanceImpactsPayment             *YesNoOtherType `json:"qualityPerformanceImpactsPayment" db:"quality_performance_impacts_payment" statusWeight:"1"`
	QualityPerformanceImpactsPaymentOther        *string         `json:"qualityPerformanceImpactsPaymentOther" db:"quality_performance_impacts_payment_other"`
	QualityPerformanceImpactsPaymentNote         *string         `json:"qualityPerformanceImpactsPaymentNote" db:"quality_performance_impacts_payment_note"`

	//Page 8
	DataSharingStarts                    *DataStartsType `json:"dataSharingStarts" db:"data_sharing_starts" statusWeight:"1"`
	DataSharingStartsOther               *string         `json:"dataSharingStartsOther" db:"data_sharing_starts_other"`
	DataSharingFrequency                 pq.StringArray  `json:"dataSharingFrequency" db:"data_sharing_frequency"`
	DataSharingFrequencyContinually      *string         `json:"dataSharingFrequencyContinually" db:"data_sharing_frequency_continually"`
	DataSharingFrequencyOther            *string         `json:"dataSharingFrequencyOther" db:"data_sharing_frequency_other"`
	DataSharingStartsNote                *string         `json:"dataSharingStartsNote" db:"data_sharing_starts_note"`
	DataCollectionStarts                 *DataStartsType `json:"dataCollectionStarts" db:"data_collection_starts" statusWeight:"1"`
	DataCollectionStartsOther            *string         `json:"dataCollectionStartsOther" db:"data_collection_starts_other"`
	DataCollectionFrequency              pq.StringArray  `json:"dataCollectionFrequency" db:"data_collection_frequency"`
	DataCollectionFrequencyContinually   *string         `json:"dataCollectionFrequencyContinually" db:"data_collection_frequency_continually"`
	DataCollectionFrequencyOther         *string         `json:"dataCollectionFrequencyOther" db:"data_collection_frequency_other"`
	DataCollectionFrequencyNote          *string         `json:"dataCollectionFrequencyNote" db:"data_collection_frequency_note"`
	QualityReportingStarts               *DataStartsType `json:"qualityReportingStarts" db:"quality_reporting_starts" statusWeight:"1"`
	QualityReportingStartsOther          *string         `json:"qualityReportingStartsOther" db:"quality_reporting_starts_other"`
	QualityReportingStartsNote           *string         `json:"qualityReportingStartsNote" db:"quality_reporting_starts_note"`
	QualityReportingFrequency            pq.StringArray  `json:"qualityReportingFrequency" db:"quality_reporting_frequency"`
	QualityReportingFrequencyContinually *string         `json:"qualityReportingFrequencyContinually" db:"quality_reporting_frequency_continually"`
	QualityReportingFrequencyOther       *string         `json:"qualityReportingFrequencyOther" db:"quality_reporting_frequency_other"`

	//Page 9
	ModelLearningSystems      pq.StringArray `json:"modelLearningSystems" db:"model_learning_systems"`
	ModelLearningSystemsOther *string        `json:"modelLearningSystemsOther" db:"model_learning_systems_other"`
	ModelLearningSystemsNote  *string        `json:"modelLearningSystemsNote" db:"model_learning_systems_note"`
	AnticipatedChallenges     *string        `json:"anticipatedChallenges" db:"anticipated_challenges" statusWeight:"1"`
}

// DataStartsType represents the possible DATASTARTSTYPE options
type DataStartsType string

// These constants represent the choices for DATASTARTSTYPE
const (
	DataStartsApplication DataStartsType = "DURING_APPLICATION_PERIOD"
	DataStartsShort       DataStartsType = "SHORTLY_BEFORE_THE_START_DATE"
	DataStartsEarly       DataStartsType = "EARLY_IN_THE_FIRST_PERFORMANCE_YEAR"
	DataStartsLater       DataStartsType = "LATER_IN_THE_FIRST_PERFORMANCE_YEAR"
	DataStartsSubsequent  DataStartsType = "IN_THE_SUBSEQUENT_PERFORMANCE_YEAR"
	DataStartsAtSome      DataStartsType = "AT_SOME_OTHER_POINT_IN_TIME"
	DataStartsNot         DataStartsType = "NOT_PLANNING_TO_DO_THIS"
	DataStartsOther       DataStartsType = "OTHER"
)

// BenchmarkForPerformanceType represents the possible BENCHMARKFORPERFORMANCETYPE options
type BenchmarkForPerformanceType string

// These constants represent the choices for BENCHMARKFORPERFORMANCETYPE
const (
	BenchmarkReconcile   BenchmarkForPerformanceType = "YES_RECONCILE"
	BenchmarkReconcileNo BenchmarkForPerformanceType = "YES_NO_RECONCILE"
	BenchmarkNo          BenchmarkForPerformanceType = "NO"
)

// DataFullTimeOrIncrementalType represents the possible DATAFULLTIMEORINCREMENTALTYPE options
type DataFullTimeOrIncrementalType string

// These constants represent the choices for DATAFULLTIMEORINCREMENTALTYPE
const (
	DataFullTime    DataFullTimeOrIncrementalType = "FULL_TIME"
	DataIncremental DataFullTimeOrIncrementalType = "INCREMENTAL"
)

// YesNoOtherType represents the possible YESNOOTHERTYPE options
type YesNoOtherType string

// These constants represent the choices for YESNOOTHERTYPE
const (
	YesNoOtherTypeYes   YesNoOtherType = "YES"
	YesNoOtherTypeNo    YesNoOtherType = "NO"
	YesNoOtherTypeOther YesNoOtherType = "OTHER"
)

// NewPlanOpsEvalAndLearning returns a new ops Eval and Learning object
func NewPlanOpsEvalAndLearning(tls baseTaskListSection) *PlanOpsEvalAndLearning {
	return &PlanOpsEvalAndLearning{
		baseTaskListSection: tls,
	}
}
