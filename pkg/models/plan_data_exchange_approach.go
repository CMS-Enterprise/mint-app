package models

import (
	"github.com/lib/pq"
)

// PlanDataExchangeApproach represents the data exchange approach of a model plan
type PlanDataExchangeApproach struct {
	baseTaskListSection

	// Page 2
	DataToCollectFromParticipants               pq.StringArray `json:"dataToCollectFromParticipants" db:"data_to_collect_from_participants" statusWeight:"1"`
	DataToCollectFromParticipantsReportsDetails *string        `json:"dataToCollectFromParticipantsReportsDetails" db:"data_to_collect_from_participants_reports_details"`
	DataToCollectFromParticipantsOther          *string        `json:"dataToCollectFromParticipantsOther" db:"data_to_collect_from_participants_other"`
	DataWillNotBeCollectedFromParticipants      bool           `json:"dataWillNotBeCollectedFromParticipants" db:"data_will_not_be_collected_from_participants" statusWeight:"1"`
	DataToCollectFromParticipantsNote           *string        `json:"dataToCollectFromParticipantsNote" db:"data_to_collect_from_participants_note"`

	DataToSendToParticipants     *DataToSendToParticipantsType `json:"dataToSendToParticipants" db:"data_to_send_to_participants"`
	DataToSendToParticipantsNote *string                       `json:"dataToSendToParticipantsNote" db:"data_to_send_to_participants_note"`

	// Page 3
	DoesNeedToMakeMultiPayerDataAvailable        *YesNoType                                        `json:"doesNeedToMakeMultiPayerDataAvailable" db:"does_need_to_make_multi_payer_data_available" statusWeight:"1"`
	AnticipatedMultiPayerDataAvailabilityUseCase *AnticipatedMultiPayerDataAvailabilityUseCaseType `json:"anticipatedMultiPayerDataAvailabilityUseCase" db:"anticipated_multi_payer_data_availability_use_case"`
	DoesNeedToMakeMultiPayerDataAvailableOther   *string                                           `json:"doesNeedToMakeMultiPayerDataAvailableOther" db:"does_need_to_make_multi_payer_data_available_other"`
	DoesNeedToMakeMultiPayerDataAvailableNote    *string                                           `json:"doesNeedToMakeMultiPayerDataAvailableNote" db:"does_need_to_make_multi_payer_data_available_note"`

	DoesNeedToCollectAndAggregateMultiSourceData     *YesNoType                    `json:"doesNeedToCollectAndAggregateMultiSourceData" db:"does_need_to_collect_and_aggregate_multi_source_data" statusWeight:"1"`
	MultiSourceDataToCollect                         *MultiSourceDataToCollectType `json:"multiSourceDataToCollect" db:"multi_source_data_to_collect"`
	MultiSourceDataToCollectOther                    *string                       `json:"multiSourceDataToCollectOther" db:"multi_source_data_to_collect_other"`
	DoesNeedToCollectAndAggregateMultiSourceDataNote *string                       `json:"doesNeedToCollectAndAggregateMultiSourceDataNote" db:"does_need_to_collect_and_aggregate_multi_source_data_note"`

	// Page 4
	WillImplementNewDataExchangeMethods *YesNoType `json:"willImplementNewDataExchangeMethods" db:"will_implement_new_data_exchange_methods" statusWeight:"1"`
	NewDataExchangeMethodsDescription   *string    `json:"newDataExchangeMethodsDescription" db:"new_data_exchange_methods_description"`
	NewDataExchangeMethodsNote          *string    `json:"newDataExchangeMethodsNote" db:"new_data_exchange_methods_note"`

	IsDataExchangeApproachComplete bool `json:"isDataExchangeApproachComplete" db:"is_data_exchange_approach_complete" statusWeight:"1"`
}

// NewPlanDataExchangeApproach creates a new PlanDataExchangeApproach with the required fields
func NewPlanDataExchangeApproach(tls baseTaskListSection) *PlanDataExchangeApproach {
	return &PlanDataExchangeApproach{
		baseTaskListSection:                    tls,
		DataWillNotBeCollectedFromParticipants: false,
		IsDataExchangeApproachComplete:         false,
	}
}

// DataToCollectFromParticipantsType represents the possible values for data to collect from participants
type DataToCollectFromParticipantsType string

// Enum values for DataToCollectFromParticipantsType
const (
	DataToCollectFromParticipantsBankingInformationToMakeNonClaimsBasedPayments DataToCollectFromParticipantsType = "BANKING_INFORMATION_TO_MAKE_NON_CLAIMS_BASED_PAYMENTS"
	DataToCollectFromParticipantsClinicalData                                   DataToCollectFromParticipantsType = "CLINICAL_DATA"
	DataToCollectFromParticipantsCollectBidsAndPlanInformation                  DataToCollectFromParticipantsType = "COLLECT_BIDS_AND_PLAN_INFORMATION"
	DataToCollectFromParticipantsCooperativeAgreementApplication                DataToCollectFromParticipantsType = "COOPERATIVE_AGREEMENT_APPLICATION"
	DataToCollectFromParticipantsDecarbonizationData                            DataToCollectFromParticipantsType = "DECARBONIZATION_DATA"
	DataToCollectFromParticipantsExpandedDemographicsData                       DataToCollectFromParticipantsType = "EXPANDED_DEMOGRAPHICS_DATA"
	DataToCollectFromParticipantsFeeForServiceClaimsAndApplyModelRules          DataToCollectFromParticipantsType = "FEE_FOR_SERVICE_CLAIMS_AND_APPLY_MODEL_RULES"
	DataToCollectFromParticipantsLearningSystemMetrics                          DataToCollectFromParticipantsType = "LEARNING_SYSTEM_METRICS"
	DataToCollectFromParticipantsParticipantAgreement                           DataToCollectFromParticipantsType = "PARTICIPANT_AGREEMENT"
	DataToCollectFromParticipantsParticipantAgreementLetterOfIntent             DataToCollectFromParticipantsType = "PARTICIPANT_AGREEMENT_LETTER_OF_INTENT"
	DataToCollectFromParticipantsParticipantAgreementRequestForApplication      DataToCollectFromParticipantsType = "PARTICIPANT_AGREEMENT_REQUEST_FOR_APPLICATION"
	DataToCollectFromParticipantsParticipantReportedData                        DataToCollectFromParticipantsType = "PARTICIPANT_REPORTED_DATA"
	DataToCollectFromParticipantsParticipantReportedQualityMeasures             DataToCollectFromParticipantsType = "PARTICIPANT_REPORTED_QUALITY_MEASURES"
	DataToCollectFromParticipantsProviderParticipantRoster                      DataToCollectFromParticipantsType = "PROVIDER_PARTICIPANT_ROSTER"
	DataToCollectFromParticipantsReportsFromParticipants                        DataToCollectFromParticipantsType = "REPORTS_FROM_PARTICIPANTS"
	DataToCollectFromParticipantsSocialDeterminantsOfHealth                     DataToCollectFromParticipantsType = "SOCIAL_DETERMINANTS_OF_HEALTH"
	DataToCollectFromParticipantsSurvey                                         DataToCollectFromParticipantsType = "SURVEY"
	DataToCollectFromParticipantsOther                                          DataToCollectFromParticipantsType = "OTHER"
)

// DataToSendToParticipantsType represents the possible values for data to send to participants
type DataToSendToParticipantsType string

// Enum values for DataToSendToParticipantsType
const (
	DataToSendToParticipantsDataFeedbackDashboard           DataToSendToParticipantsType = "DATA_FEEDBACK_DASHBOARD"
	DataToSendToParticipantsNonClaimsBasedPayments          DataToSendToParticipantsType = "NON_CLAIMS_BASED_PAYMENTS"
	DataToSendToParticipantsOperationsData                  DataToSendToParticipantsType = "OPERATIONS_DATA"
	DataToSendToParticipantsPartiallyAdjustedClaimsData     DataToSendToParticipantsType = "PARTIALLY_ADJUSTED_CLAIMS_DATA"
	DataToSendToParticipantsRawClaimsData                   DataToSendToParticipantsType = "RAW_CLAIMS_DATA"
	DataToSendToParticipantsDataWillNotBeSentToParticipants DataToSendToParticipantsType = "DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS"
)

// AnticipatedMultiPayerDataAvailabilityUseCaseType represents the possible values for anticipated multi-payer data availability use case
type AnticipatedMultiPayerDataAvailabilityUseCaseType string

// Enum values for AnticipatedMultiPayerDataAvailabilityUseCaseType
const (
	AnticipatedMultiPayerDataAvailabilityUseCaseMoreCompetentAlertDischargeTransferNotification   AnticipatedMultiPayerDataAvailabilityUseCaseType = "MORE_COMPETENT_ALERT_DISCHARGE_TRANSFER_NOTIFICATION"
	AnticipatedMultiPayerDataAvailabilityUseCaseSupplyMultiPayerClaimsCostUtilAndQualityReporting AnticipatedMultiPayerDataAvailabilityUseCaseType = "SUPPLY_MULTI_PAYER_CLAIMS_COST_UTIL_AND_QUALITY_REPORTING"
	AnticipatedMultiPayerDataAvailabilityUseCaseFillGapsInCareAlertingAndReports                  AnticipatedMultiPayerDataAvailabilityUseCaseType = "FILL_GAPS_IN_CARE_ALERTING_AND_REPORTS"
)

// MultiSourceDataToCollectType represents the possible values for multi-source data to collect
type MultiSourceDataToCollectType string

// Enum values for MultiSourceDataToCollectType
const (
	MultiSourceDataToCollectCommercialClaims MultiSourceDataToCollectType = "COMMERCIAL_CLAIMS"
	MultiSourceDataToCollectLabData          MultiSourceDataToCollectType = "LAB_DATA"
	MultiSourceDataToCollectManufacturer     MultiSourceDataToCollectType = "MANUFACTURER"
	MultiSourceDataToCollectMedicaidClaims   MultiSourceDataToCollectType = "MEDICAID_CLAIMS"
	MultiSourceDataToCollectMedicareClaims   MultiSourceDataToCollectType = "MEDICARE_CLAIMS"
	MultiSourceDataToCollectPatientRegistry  MultiSourceDataToCollectType = "PATIENT_REGISTRY"
	MultiSourceDataToCollectOther            MultiSourceDataToCollectType = "OTHER"
)
