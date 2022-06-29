package models

import (
	"database/sql/driver"
	"time"

	"github.com/google/uuid"
)

//PlanOpsEvalAndLearning represents the tasks list section that handles information around operations, evaluation, and learning
type PlanOpsEvalAndLearning struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	//Page 1
	AgencyOrStateHelp      AgencyOrStateHelpTypeG `json:"agencyOrStateHelp" db:"agency_or_state_help"`
	AgencyOrStateHelpOther *string                `json:"agencyOrStateHelpOther" db:"agency_or_state_help_other"`
	AgencyOrStateHelpNote  *string                `json:"agencyOrStateHelpNote" db:"agency_or_state_help_note"`
	Stakeholders           StakeholdersTypeG      `json:"stakeholders" db:"stakeholders"`
	StakeholdersOther      *string                `json:"stakeholdersOther" db:"stakeholders_other"`
	StakeholdersNote       *string                `json:"stakeholdersNote" db:"stakeholders_note"`
	HelpdeskUse            *bool                  `json:"helpdeskUse" db:"helpdesk_use"`
	HelpdeskUseNote        *string                `json:"helpdeskUseNote" db:"helpdesk_use_note"`
	ContractorSupport      ContractorSupportTypeG `json:"contractorSupport" db:"contractor_support"`
	ContractorSupportOther *string                `json:"contractorSupportOther" db:"contractor_support_other"`
	ContractorSupportHow   *string                `json:"contractorSupportHow" db:"contractor_support_how"`
	ContractorSupportNote  *string                `json:"contractorSupportNote" db:"contractor_support_note"`
	IddocSupport           *bool                  `json:"iddocSupport" db:"iddoc_support" statusWeight:"1"`
	IddocSupportNote       *string                `json:"iddocSupportNote" db:"iddoc_support_note"`

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
	UatNeeds                  *string             `json:"uatNeeds" db:"uat_needs"`
	StcNeeds                  *string             `json:"stcNeeds" db:"stc_needs"`
	TestingTimelines          *string             `json:"testingTimelines" db:"testing_timelines"`
	TestingNote               *string             `json:"testingNote" db:"testing_note"`
	DataMonitoringFileTypes   MonitoringFileTypeG `json:"dataMonitoringFileTypes" db:"data_monitoring_file_types"`
	DataMonitoringFileOther   *string             `json:"dataMonitoringFileOther" db:"data_monitoring_file_other"`
	DataResponseType          *string             `json:"dataResponseType" db:"data_response_type"`
	DataResponseFileFrequency *string             `json:"dataResponseFileFrequency" db:"data_response_file_frequency"`

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
	EvaluationApproaches          EvaluationApproachTypeG     `json:"evaluationApproaches" db:"evaluation_approaches"`
	EvaluationApproachOther       *string                     `json:"evaluationApproachOther" db:"evaluation_approach_other"`
	EvalutaionApproachNote        *string                     `json:"evalutaionApproachNote" db:"evalutaion_approach_note"`
	CcmInvolvment                 CcmInvolvmentTypeG          `json:"ccmInvolvment" db:"ccm_involvment"`
	CcmInvolvmentOther            *string                     `json:"ccmInvolvmentOther" db:"ccm_involvment_other"`
	CcmInvolvmentNote             *string                     `json:"ccmInvolvmentNote" db:"ccm_involvment_note"`
	DataNeededForMonitoring       DataForMonitoringTypeG      `json:"dataNeededForMonitoring" db:"data_needed_for_monitoring"`
	DataNeededForMonitoringOther  *string                     `json:"dataNeededForMonitoringOther" db:"data_needed_for_monitoring_other"`
	DataNeededForMonitoringNote   *string                     `json:"dataNeededForMonitoringNote" db:"data_needed_for_monitoring_note"`
	DataToSendParticicipants      DataToSendParticipantsTypeG `json:"dataToSendParticicipants" db:"data_to_send_particicipants"`
	DataToSendParticicipantsOther *string                     `json:"dataToSendParticicipantsOther" db:"data_to_send_particicipants_other"`
	DataToSendParticicipantsNote  *string                     `json:"dataToSendParticicipantsNote" db:"data_to_send_particicipants_note"`
	ShareCclfData                 *bool                       `json:"shareCclfData" db:"share_cclf_data" statusWeight:"1"`
	ShareCclfDataNote             *string                     `json:"shareCclfDataNote" db:"share_cclf_data_note"`

	//Page 7
	SendFilesBetweenCcw                          *bool   `json:"sendFilesBetweenCcw" db:"send_files_between_ccw" statusWeight:"1"`
	SendFilesBetweenCcwNote                      *string `json:"sendFilesBetweenCcwNote" db:"send_files_between_ccw_note"`
	AppToSendFilesToKnown                        *bool   `json:"appToSendFilesToKnown" db:"app_to_send_files_to_known" statusWeight:"1"`
	AppToSendFilesToWhich                        *string `json:"appToSendFilesToWhich" db:"app_to_send_files_to_which"`
	AppToSendFilesToNote                         *string `json:"appToSendFilesToNote" db:"app_to_send_files_to_note"`
	UseCcwForFileDistribiutionToParticipants     *bool   `json:"useCcwForFileDistribiutionToParticipants" db:"use_ccw_for_file_distribiution_to_participants" statusWeight:"1"`
	UseCcwForFileDistribiutionToParticipantsNote *string `json:"useCcwForFileDistribiutionToParticipantsNote" db:"use_ccw_for_file_distribiution_to_participants_note"`
	DevelopNewQualityMeasures                    *bool   `json:"developNewQualityMeasures" db:"develop_new_quality_measures" statusWeight:"1"`
	DevelopNewQualityMeasuresNote                *string `json:"developNewQualityMeasuresNote" db:"develop_new_quality_measures_note"`
	QualityPerformanceImpactsPayment             *bool   `json:"qualityPerformanceImpactsPayment" db:"quality_performance_impacts_payment" statusWeight:"1"`
	QualityPerformanceImpactsPaymentNote         *string `json:"qualityPerformanceImpactsPaymentNote" db:"quality_performance_impacts_payment_note"`

	//Page 8
	DataSharingStarts            *DataStartsType    `json:"dataSharingStarts" db:"data_sharing_starts" statusWeight:"1"`
	DataSharingStartsOther       *string            `json:"dataSharingStartsOther" db:"data_sharing_starts_other"`
	DataSharingFrequency         DataFrequencyTypeG `json:"dataSharingFrequency" db:"data_sharing_frequency"`
	DataSharingFrequencyOther    *string            `json:"dataSharingFrequencyOther" db:"data_sharing_frequency_other"`
	DataSharingStartsNote        *string            `json:"dataSharingStartsNote" db:"data_sharing_starts_note"`
	DataCollectionStarts         *DataStartsType    `json:"dataCollectionStarts" db:"data_collection_starts" statusWeight:"1"`
	DataCollectionStartsOther    *string            `json:"dataCollectionStartsOther" db:"data_collection_starts_other"`
	DataCollectionFrequency      DataFrequencyTypeG `json:"dataCollectionFrequency" db:"data_collection_frequency"`
	DataCollectionFrequencyOther *string            `json:"dataCollectionFrequencyOther" db:"data_collection_frequency_other"`
	DataCollectionFrequencyNote  *string            `json:"dataCollectionFrequencyNote" db:"data_collection_frequency_note"`
	QualityReportingStarts       *DataStartsType    `json:"qualityReportingStarts" db:"quality_reporting_starts" statusWeight:"1"`
	QualityReportingStartsOther  *string            `json:"qualityReportingStartsOther" db:"quality_reporting_starts_other"`
	QualityReportingStartsNote   *string            `json:"qualityReportingStartsNote" db:"quality_reporting_starts_note"`

	//Page 9
	ModelLearningSystems      ModelLearningSystemTypeG `json:"modelLearningSystems" db:"model_learning_systems"`
	ModelLearningSystemsOther *string                  `json:"modelLearningSystemsOther" db:"model_learning_systems_other"`
	ModelLearningSystemsNote  *string                  `json:"modelLearningSystemsNote" db:"model_learning_systems_note"`
	AnticipatedChallenges     *string                  `json:"anticipatedChallenges" db:"anticipated_challenges" statusWeight:"1"`

	// Meta
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

//DataStartsType represents the possible DATASTARTSTYPE options
type DataStartsType string

//These constants represent the choices for DATASTARTSTYPE
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

//BenchmarkForPerformanceType represents the possible BENCHMARKFORPERFORMANCETYPE options
type BenchmarkForPerformanceType string

//These constants represent the choices for BENCHMARKFORPERFORMANCETYPE
const (
	BenchmarkReconcile   BenchmarkForPerformanceType = "YES_RECONCILE"
	BenchmarkReconcileNo BenchmarkForPerformanceType = "YES_NO_RECONCILE"
	BenchmarkNo          BenchmarkForPerformanceType = "NO"
)

//DataFullTimeOrIncrementalType represents the possible DATAFULLTIMEORINCREMENTALTYPE options
type DataFullTimeOrIncrementalType string

//These constants represent the choices for DATAFULLTIMEORINCREMENTALTYPE
const (
	DataFullTime    DataFullTimeOrIncrementalType = "FULL_TIME"
	DataIncremental DataFullTimeOrIncrementalType = "INCREMENTAL"
)

// CalcStatus returns a TaskStatus based on how many fields have been entered in the PlanOpsEvalAndLearning struct
func (oel *PlanOpsEvalAndLearning) CalcStatus() error {

	status, err := GenericallyCalculateStatus(*oel)
	if err != nil {
		return err
	}

	oel.Status = status
	return nil
}

// GetModelTypeName returns the name of the model
func (oel PlanOpsEvalAndLearning) GetModelTypeName() string {
	return "Plan_Ops_Eval_And_Learning"
}

// GetID returns the ID property for a PlanOpsEvalAndLearning struct
func (oel PlanOpsEvalAndLearning) GetID() uuid.UUID {
	return oel.ID
}

// GetPlanID returns the ModelPlanID property for a PlanOpsEvalAndLearning struct
func (oel PlanOpsEvalAndLearning) GetPlanID() uuid.UUID {
	return oel.ModelPlanID
}

// GetModifiedBy returns the ModifiedBy property for a PlanOpsEvalAndLearning struct
func (oel PlanOpsEvalAndLearning) GetModifiedBy() *string {
	return oel.ModifiedBy
}

// GetCreatedBy returns the ModifiedBy property for a PlanOpsEvalAndLearning struct
func (oel PlanOpsEvalAndLearning) GetCreatedBy() string {
	return oel.CreatedBy
}

//AgencyOrStateHelpTypeG is an array of AgencyOrStateHelpType
type AgencyOrStateHelpTypeG []AgencyOrStateHelpType

//Scan is used by sql.scan to read the values from the DB
func (a *AgencyOrStateHelpTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a AgencyOrStateHelpTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// AgencyOrStateHelpType represents the types of AgencyOrStateHelp types.
type AgencyOrStateHelpType string

//These are the options for AgencyOrStateHelpType
const (
	AOSTYesState       AgencyOrStateHelpType = "YES_STATE"
	AOSTYesAgencyIdeas AgencyOrStateHelpType = "YES_AGENCY_IDEAS"
	AOSTYesAgencyIaa   AgencyOrStateHelpType = "YES_AGENCY_IAA"
	AOSTNo             AgencyOrStateHelpType = "NO"
	AOSTOther          AgencyOrStateHelpType = "OTHER"
)

//StakeholdersTypeG is an array of StakeholdersType
type StakeholdersTypeG []StakeholdersType

//Scan is used by sql.scan to read the values from the DB
func (a *StakeholdersTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a StakeholdersTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// StakeholdersType represents the types of Stakeholders types.
type StakeholdersType string

//These are the options for StakeholdersType
const (
	STKTBeneficiaries             StakeholdersType = "BENEFICIARIES"
	STKTCommunityOrganizations    StakeholdersType = "COMMUNITY_ORGANIZATIONS"
	STKTParticipants              StakeholdersType = "PARTICIPANTS"
	STKTProfessionalOrganizations StakeholdersType = "PROFESSIONAL_ORGANIZATIONS"
	STKTProviders                 StakeholdersType = "PROVIDERS"
	STKTStates                    StakeholdersType = "STATES"
	STKTOther                     StakeholdersType = "OTHER"
)

//ContractorSupportTypeG is an array of ContractorSupportType
type ContractorSupportTypeG []ContractorSupportType

//Scan is used by sql.scan to read the values from the DB
func (a *ContractorSupportTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a ContractorSupportTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// ContractorSupportType represents the types of ContractorSupport types.
type ContractorSupportType string

//These are the options for ContractorSupportType
const (
	CSTOne      ContractorSupportType = "ONE"
	CSTMultiple ContractorSupportType = "MULTIPLE"
	CSTNone     ContractorSupportType = "NONE"
	CSTOther    ContractorSupportType = "OTHER"
)

//MonitoringFileTypeG is an array of MonitoringFileType
type MonitoringFileTypeG []MonitoringFileType

//Scan is used by sql.scan to read the values from the DB
func (a *MonitoringFileTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a MonitoringFileTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// MonitoringFileType represents the types of MonitoringFile types.
type MonitoringFileType string

//These are the options for MonitoringFileType
const (
	MFTBeneficiary MonitoringFileType = "BENEFICIARY"
	MFTProvider    MonitoringFileType = "PROVIDER"
	MFTPartA       MonitoringFileType = "PART_A"
	MFTPartB       MonitoringFileType = "PART_B"
	MFTOther       MonitoringFileType = "OTHER"
)

//EvaluationApproachTypeG is an array of EvaluationApproachType
type EvaluationApproachTypeG []EvaluationApproachType

//Scan is used by sql.scan to read the values from the DB
func (a *EvaluationApproachTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a EvaluationApproachTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// EvaluationApproachType represents the types of EvaluationApproach types.
type EvaluationApproachType string

//These are the options for EvaluationApproachType
const (
	EATControlIntervention EvaluationApproachType = "CONTROL_INTERVENTION"
	EATComparisonMatch     EvaluationApproachType = "COMPARISON_MATCH"
	EATInterruptedTime     EvaluationApproachType = "INTERRUPTED_TIME"
	EATNonMedicareData     EvaluationApproachType = "NON_MEDICARE_DATA"
	EATOther               EvaluationApproachType = "OTHER"
)

//CcmInvolvmentTypeG is an array of CcmInvolvmentType
type CcmInvolvmentTypeG []CcmInvolvmentType

//Scan is used by sql.scan to read the values from the DB
func (a *CcmInvolvmentTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a CcmInvolvmentTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// CcmInvolvmentType represents the types of CcmInvolvment types.
type CcmInvolvmentType string

//These are the options for CcmInvolvmentType
const (
	CITYesEvaluation     CcmInvolvmentType = "YES_EVALUATION"
	CITYesImplementation CcmInvolvmentType = "YES__IMPLEMENTATION"
	CITNo                CcmInvolvmentType = "NO"
	CITOther             CcmInvolvmentType = "OTHER"
)

//DataForMonitoringTypeG is an array of DataForMonitoringType
type DataForMonitoringTypeG []DataForMonitoringType

//Scan is used by sql.scan to read the values from the DB
func (a *DataForMonitoringTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a DataForMonitoringTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// DataForMonitoringType represents the types of DataForMonitoring types.
type DataForMonitoringType string

//These are the options for DataForMonitoringType
const (
	DFMTSiteVisits                 DataForMonitoringType = "SITE_VISITS"
	DFMTMedicareClaims             DataForMonitoringType = "MEDICARE_CLAIMS"
	DFMTMedicaidClaims             DataForMonitoringType = "MEDICAID_CLAIMS"
	DFMTEncounterData              DataForMonitoringType = "ENCOUNTER_DATA"
	DFMTNoPayClaims                DataForMonitoringType = "NO_PAY_CLAIMS"
	DFMTQualityClaimsBasedMeasures DataForMonitoringType = "QUALITY_CLAIMS_BASED_MEASURES"
	DFMTQualityReportedMeasures    DataForMonitoringType = "QUALITY_REPORTED_MEASURES"
	DFMTClinicalData               DataForMonitoringType = "CLINICAL_DATA"
	DFMTNonClinicalData            DataForMonitoringType = "NON_CLINICAL_DATA"
	DFMTNonMedicalData             DataForMonitoringType = "NON_MEDICAL_DATA"
	DFMTOther                      DataForMonitoringType = "OTHER"
	DFMTNotPlanningToCollectData   DataForMonitoringType = "NOT_PLANNING_TO_COLLECT_DATA"
)

//DataToSendParticipantsTypeG is an array of DataToSendParticipantsType
type DataToSendParticipantsTypeG []DataToSendParticipantsType

//Scan is used by sql.scan to read the values from the DB
func (a *DataToSendParticipantsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a DataToSendParticipantsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// DataToSendParticipantsType represents the types of DataToSendParticipants types.
type DataToSendParticipantsType string

//These are the options for DataToSendParticipantsType
const (
	DTSPTBaselineHistoricalData DataToSendParticipantsType = "BASELINE_HISTORICAL_DATA"
	DTSPTClaimsLevelData        DataToSendParticipantsType = "CLAIMS_LEVEL_DATA"
	DTSPTBeneficiaryLevelData   DataToSendParticipantsType = "BENEFICIARY_LEVEL_DATA"
	DTSPTParticipantLevelData   DataToSendParticipantsType = "PARTICIPANT_LEVEL_DATA"
	DTSPTProviderLevelData      DataToSendParticipantsType = "PROVIDER_LEVEL_DATA"
	DTSPTOtherMipsData          DataToSendParticipantsType = "OTHER_MIPS_DATA"
	DTSPTNotPlanningToSendData  DataToSendParticipantsType = "NOT_PLANNING_TO_SEND_DATA"
)

//DataFrequencyTypeG is an array of DataFrequencyType
type DataFrequencyTypeG []DataFrequencyType

//Scan is used by sql.scan to read the values from the DB
func (a *DataFrequencyTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a DataFrequencyTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// DataFrequencyType represents the types of DataFrequency types.
type DataFrequencyType string

//These are the options for DataFrequencyType
const (
	DFTAnnually            DataFrequencyType = "ANNUALLY"
	DFTBiannually          DataFrequencyType = "BIANNUALLY"
	DFTQuarterly           DataFrequencyType = "QUARTERLY"
	DFTMonthly             DataFrequencyType = "MONTHLY"
	DFTSemiMonthly         DataFrequencyType = "SEMI_MONTHLY"
	DFTWeekly              DataFrequencyType = "WEEKLY"
	DFTDaily               DataFrequencyType = "DAILY"
	DFTOther               DataFrequencyType = "OTHER"
	DFTNotPlanningToDoThis DataFrequencyType = "NOT_PLANNING_TO_DO_THIS"
)

//ModelLearningSystemTypeG is an array of ModelLearningSystemType
type ModelLearningSystemTypeG []ModelLearningSystemType

//Scan is used by sql.scan to read the values from the DB
func (a *ModelLearningSystemTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a ModelLearningSystemTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// ModelLearningSystemType represents the types of ModelLearningSystem types.
type ModelLearningSystemType string

//These are the options for ModelLearningSystemType
const (
	MLSTLearningContractor       ModelLearningSystemType = "LEARNING_CONTRACTOR"
	MLSTItPlatformConnect        ModelLearningSystemType = "IT_PLATFORM_CONNECT"
	MLSTParticipantCollaboration ModelLearningSystemType = "PARTICIPANT_COLLABORATION"
	MLSTEducateBeneficiaries     ModelLearningSystemType = "EDUCATE_BENEFICIARIES"
	MLSTOther                    ModelLearningSystemType = "OTHER"
	MLSTNoLearningSystem         ModelLearningSystemType = "NO_LEARNING_SYSTEM"
)
