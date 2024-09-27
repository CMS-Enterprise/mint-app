package models

import (
	"github.com/lib/pq"
)

// PlanDataExchangeApproach represents the data exchange approach of a model plan
type PlanDataExchangeApproach struct {
	coreTaskListSection
	markedCompleteByRelation

	// Page 2
	DataToCollectFromParticipants               pq.StringArray `json:"dataToCollectFromParticipants" db:"data_to_collect_from_participants" statusWeight:"1"`
	DataToCollectFromParticipantsReportsDetails *string        `json:"dataToCollectFromParticipantsReportsDetails" db:"data_to_collect_from_participants_reports_details"`
	DataToCollectFromParticipantsOther          *string        `json:"dataToCollectFromParticipantsOther" db:"data_to_collect_from_participants_other"`
	DataWillNotBeCollectedFromParticipants      bool           `json:"dataWillNotBeCollectedFromParticipants" db:"data_will_not_be_collected_from_participants" statusWeight:"1"`
	DataToCollectFromParticipantsNote           *string        `json:"dataToCollectFromParticipantsNote" db:"data_to_collect_from_participants_note"`

	DataToSendToParticipants     pq.StringArray `json:"dataToSendToParticipants" db:"data_to_send_to_participants"`
	DataToSendToParticipantsNote *string        `json:"dataToSendToParticipantsNote" db:"data_to_send_to_participants_note"`

	// Page 3
	DoesNeedToMakeMultiPayerDataAvailable        *YesNoType                                    `json:"doesNeedToMakeMultiPayerDataAvailable" db:"does_need_to_make_multi_payer_data_available" statusWeight:"1"`
	AnticipatedMultiPayerDataAvailabilityUseCase *AnticipatedMultiPayerDataAvailabilityUseCase `json:"anticipatedMultiPayerDataAvailabilityUseCase" db:"anticipated_multi_payer_data_availability_use_case"`
	DoesNeedToMakeMultiPayerDataAvailableNote    *string                                       `json:"doesNeedToMakeMultiPayerDataAvailableNote" db:"does_need_to_make_multi_payer_data_available_note"`

	DoesNeedToCollectAndAggregateMultiSourceData     *YesNoType     `json:"doesNeedToCollectAndAggregateMultiSourceData" db:"does_need_to_collect_and_aggregate_multi_source_data" statusWeight:"1"`
	MultiSourceDataToCollect                         pq.StringArray `json:"multiSourceDataToCollect" db:"multi_source_data_to_collect"`
	MultiSourceDataToCollectOther                    *string        `json:"multiSourceDataToCollectOther" db:"multi_source_data_to_collect_other"`
	DoesNeedToCollectAndAggregateMultiSourceDataNote *string        `json:"doesNeedToCollectAndAggregateMultiSourceDataNote" db:"does_need_to_collect_and_aggregate_multi_source_data_note"`

	// Page 4
	WillImplementNewDataExchangeMethods *YesNoType `json:"willImplementNewDataExchangeMethods" db:"will_implement_new_data_exchange_methods" statusWeight:"1"`
	NewDataExchangeMethodsDescription   *string    `json:"newDataExchangeMethodsDescription" db:"new_data_exchange_methods_description"`
	NewDataExchangeMethodsNote          *string    `json:"newDataExchangeMethodsNote" db:"new_data_exchange_methods_note"`

	AdditionalDataExchangeConsiderationsDescription *string `json:"additionalDataExchangeConsiderationsDescription" db:"additional_data_exchange_considerations_description"`

	IsDataExchangeApproachComplete bool `json:"isDataExchangeApproachComplete" db:"is_data_exchange_approach_complete" statusWeight:"1"`
}

// NewPlanDataExchangeApproach creates a new PlanDataExchangeApproach with the required fields
func NewPlanDataExchangeApproach(tls coreTaskListSection) *PlanDataExchangeApproach {
	return &PlanDataExchangeApproach{
		coreTaskListSection:                    tls,
		DataWillNotBeCollectedFromParticipants: false,
		IsDataExchangeApproachComplete:         false,
	}
}

// NewPlanDataExchangeApproachFromBaseTaskListSection creates a new PlanDataExchangeApproach from a base task list section
func NewPlanDataExchangeApproachFromBaseTaskListSection(tls baseTaskListSection) *PlanDataExchangeApproach {
	return &PlanDataExchangeApproach{
		coreTaskListSection:                    tls.coreTaskListSection,
		DataWillNotBeCollectedFromParticipants: false,
		IsDataExchangeApproachComplete:         false,
	}
}

// DataToCollectFromParticipants represents the possible values for data to collect from participants
type DataToCollectFromParticipants string

// Enum values for DataToCollectFromParticipantsType
const (
	DataToCollectFromParticipantsBankingInformationToMakeNonClaimsBasedPayments DataToCollectFromParticipants = "BANKING_INFORMATION_TO_MAKE_NON_CLAIMS_BASED_PAYMENTS"
	DataToCollectFromParticipantsClinicalData                                   DataToCollectFromParticipants = "CLINICAL_DATA"
	DataToCollectFromParticipantsCollectBidsAndPlanInformation                  DataToCollectFromParticipants = "COLLECT_BIDS_AND_PLAN_INFORMATION"
	DataToCollectFromParticipantsCooperativeAgreementApplication                DataToCollectFromParticipants = "COOPERATIVE_AGREEMENT_APPLICATION"
	DataToCollectFromParticipantsDecarbonizationData                            DataToCollectFromParticipants = "DECARBONIZATION_DATA"
	DataToCollectFromParticipantsExpandedDemographicsData                       DataToCollectFromParticipants = "EXPANDED_DEMOGRAPHICS_DATA"
	DataToCollectFromParticipantsFeeForServiceClaimsAndApplyModelRules          DataToCollectFromParticipants = "FEE_FOR_SERVICE_CLAIMS_AND_APPLY_MODEL_RULES"
	DataToCollectFromParticipantsLearningSystemMetrics                          DataToCollectFromParticipants = "LEARNING_SYSTEM_METRICS"
	DataToCollectFromParticipantsParticipantAgreement                           DataToCollectFromParticipants = "PARTICIPANT_AGREEMENT"
	DataToCollectFromParticipantsParticipantAgreementLetterOfIntent             DataToCollectFromParticipants = "PARTICIPANT_AGREEMENT_LETTER_OF_INTENT"
	DataToCollectFromParticipantsParticipantAgreementRequestForApplication      DataToCollectFromParticipants = "PARTICIPANT_AGREEMENT_REQUEST_FOR_APPLICATION"
	DataToCollectFromParticipantsParticipantReportedData                        DataToCollectFromParticipants = "PARTICIPANT_REPORTED_DATA"
	DataToCollectFromParticipantsParticipantReportedQualityMeasures             DataToCollectFromParticipants = "PARTICIPANT_REPORTED_QUALITY_MEASURES"
	DataToCollectFromParticipantsProviderParticipantRoster                      DataToCollectFromParticipants = "PROVIDER_PARTICIPANT_ROSTER"
	DataToCollectFromParticipantsReportsFromParticipants                        DataToCollectFromParticipants = "REPORTS_FROM_PARTICIPANTS"
	DataToCollectFromParticipantsSocialDeterminantsOfHealth                     DataToCollectFromParticipants = "SOCIAL_DETERMINANTS_OF_HEALTH"
	DataToCollectFromParticipantsSurvey                                         DataToCollectFromParticipants = "SURVEY"
	DataToCollectFromParticipantsOther                                          DataToCollectFromParticipants = "OTHER"
)

// DataToSendToParticipants represents the possible values for data to send to participants
type DataToSendToParticipants string

// Enum values for DataToSendToParticipantsType
const (
	DataToSendToParticipantsDataFeedbackDashboard           DataToSendToParticipants = "DATA_FEEDBACK_DASHBOARD"
	DataToSendToParticipantsNonClaimsBasedPayments          DataToSendToParticipants = "NON_CLAIMS_BASED_PAYMENTS"
	DataToSendToParticipantsOperationsData                  DataToSendToParticipants = "OPERATIONS_DATA"
	DataToSendToParticipantsPartiallyAdjustedClaimsData     DataToSendToParticipants = "PARTIALLY_ADJUSTED_CLAIMS_DATA"
	DataToSendToParticipantsRawClaimsData                   DataToSendToParticipants = "RAW_CLAIMS_DATA"
	DataToSendToParticipantsDataWillNotBeSentToParticipants DataToSendToParticipants = "DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS"
)

// AnticipatedMultiPayerDataAvailabilityUseCase represents the possible values for anticipated multi-payer data availability use case
type AnticipatedMultiPayerDataAvailabilityUseCase string

// Enum values for AnticipatedMultiPayerDataAvailabilityUseCase
const (
	AnticipatedMultiPayerDataAvailabilityUseCaseMoreCompetentAlertDischargeTransferNotification   AnticipatedMultiPayerDataAvailabilityUseCase = "MORE_COMPETENT_ALERT_DISCHARGE_TRANSFER_NOTIFICATION"
	AnticipatedMultiPayerDataAvailabilityUseCaseSupplyMultiPayerClaimsCostUtilAndQualityReporting AnticipatedMultiPayerDataAvailabilityUseCase = "SUPPLY_MULTI_PAYER_CLAIMS_COST_UTIL_AND_QUALITY_REPORTING"
	AnticipatedMultiPayerDataAvailabilityUseCaseFillGapsInCareAlertingAndReports                  AnticipatedMultiPayerDataAvailabilityUseCase = "FILL_GAPS_IN_CARE_ALERTING_AND_REPORTS"
)

// MultiSourceDataToCollect represents the possible values for multi-source data to collect
type MultiSourceDataToCollect string

// Enum values for MultiSourceDataToCollect
const (
	MultiSourceDataToCollectCommercialClaims MultiSourceDataToCollect = "COMMERCIAL_CLAIMS"
	MultiSourceDataToCollectLabData          MultiSourceDataToCollect = "LAB_DATA"
	MultiSourceDataToCollectManufacturer     MultiSourceDataToCollect = "MANUFACTURER"
	MultiSourceDataToCollectMedicaidClaims   MultiSourceDataToCollect = "MEDICAID_CLAIMS"
	MultiSourceDataToCollectMedicareClaims   MultiSourceDataToCollect = "MEDICARE_CLAIMS"
	MultiSourceDataToCollectPatientRegistry  MultiSourceDataToCollect = "PATIENT_REGISTRY"
	MultiSourceDataToCollectOther            MultiSourceDataToCollect = "OTHER"
)
