package models

import (
	"time"

	"github.com/lib/pq"
)

// ComplexityCalculationLevelType is an enumeration of options for this category
type ComplexityCalculationLevelType string

//goland:noinspection ALL
const (
	// ComplexityCalculationLevelTypeLow indicates a low level of calculation complexity
	ComplexityCalculationLevelTypeLow ComplexityCalculationLevelType = "LOW"
	// ComplexityCalculationLevelTypeMiddle indicates a moderate level of calculation complexity
	ComplexityCalculationLevelTypeMiddle ComplexityCalculationLevelType = "MIDDLE"
	// ComplexityCalculationLevelTypeHigh indicates a high level of calculation complexity
	ComplexityCalculationLevelTypeHigh ComplexityCalculationLevelType = "HIGH"
)

// ClaimsBasedPayType is the enumeration of options for this category
type ClaimsBasedPayType string

//goland:noinspection ALL
const (
	// ClaimsBasedPayTypeAdjustmentsToFFSPayments indicates adjustments to FFS payments
	ClaimsBasedPayTypeAdjustmentsToFFSPayments ClaimsBasedPayType = "ADJUSTMENTS_TO_FFS_PAYMENTS"
	// ClaimsBasedPayTypeCareManagementHomeVisits indicates care management home visits
	ClaimsBasedPayTypeCareManagementHomeVisits ClaimsBasedPayType = "CARE_MANAGEMENT_HOME_VISITS"
	// ClaimsBasedPayTypeSNFClaimsWithout3DayHospitalAdmissions indicates SNF claims without 3-Day hospital admissions
	ClaimsBasedPayTypeSNFClaimsWithout3DayHospitalAdmissions ClaimsBasedPayType = "SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS"
	// ClaimsBasedPayTypeTeleHealthServicesNotTraditionalMedicare indicates TeleHealth services not traditional medicare
	ClaimsBasedPayTypeTeleHealthServicesNotTraditionalMedicare ClaimsBasedPayType = "TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE"
	// ClaimsBasedPayTypePaymentsForPostDischargeHomeVisits indicates payments for post discharge home visits
	ClaimsBasedPayTypePaymentsForPostDischargeHomeVisits ClaimsBasedPayType = "PAYMENTS_FOR_POST_DISCHARGE_HOME_VISITS"
)

// FundingSource is an enumeration of options for this category
type FundingSource string

//goland:noinspection ALL
const (
	// FundingSourcePatientProtectionAffordableCareAct indicates the funding source is categorically patient protection affordable care act
	FundingSourcePatientProtectionAffordableCareAct FundingSource = "PATIENT_PROTECTION_AFFORDABLE_CARE_ACT"
	// FundingSourceTrustFund indicates the funding source is categorically trust fund
	FundingSourceTrustFund FundingSource = "TRUST_FUND"

	FundingSourceMedicareA FundingSource = "MEDICARE_PART_A_HI_TRUST_FUND"

	FundingSourceMedicareB FundingSource = "MEDICARE_PART_B_SMI_TRUST_FUND"
	// FundingSourceOther indicates the funding source is not included in the provided options
	FundingSourceOther FundingSource = "Other"
)

// NonClaimsBasedPaymentType is the enumeration of options for this category
type NonClaimsBasedPaymentType string

//goland:noinspection ALL
const (
	// NonClaimsBasedPaymentTypeAdvancedPayment indicates advanced payment
	NonClaimsBasedPaymentTypeAdvancedPayment NonClaimsBasedPaymentType = "ADVANCED_PAYMENT"
	// NonClaimsBasedPaymentTypeBundledEpisodeOfCare indicates bundled episode of care
	NonClaimsBasedPaymentTypeBundledEpisodeOfCare NonClaimsBasedPaymentType = "BUNDLED_EPISODE_OF_CARE"
	// NonClaimsBasedPaymentTypeCapitationPopulationBasedFull indicates capitation population based full
	NonClaimsBasedPaymentTypeCapitationPopulationBasedFull NonClaimsBasedPaymentType = "CAPITATION_POPULATION_BASED_FULL"
	// NonClaimsBasedPaymentTypeCapitationPopulationBasedPartial indicates capitation population based partial
	NonClaimsBasedPaymentTypeCapitationPopulationBasedPartial NonClaimsBasedPaymentType = "CAPITATION_POPULATION_BASED_PARTIAL"
	// NonClaimsBasedPaymentTypeCareCoordinationManagementFee indicates care coordination management fee
	NonClaimsBasedPaymentTypeCareCoordinationManagementFee NonClaimsBasedPaymentType = "CARE_COORDINATION_MANAGEMENT_FEE"
	// NonClaimsBasedPaymentTypeGlobalBudget indicates global budget
	NonClaimsBasedPaymentTypeGlobalBudget NonClaimsBasedPaymentType = "GLOBAL_BUDGET"
	// NonClaimsBasedPaymentTypeIncentivePayment indicates incentive payment
	NonClaimsBasedPaymentTypeIncentivePayment NonClaimsBasedPaymentType = "INCENTIVE_PAYMENT"
	// NonClaimsBasedPaymentTypeMAPDSharedSavings indicates MAPD shared savings
	NonClaimsBasedPaymentTypeMAPDSharedSavings NonClaimsBasedPaymentType = "MAPD_SHARED_SAVINGS"
	// NonClaimsBasedPaymentTypeSharedSavings indicates shared savings
	NonClaimsBasedPaymentTypeSharedSavings NonClaimsBasedPaymentType = "SHARED_SAVINGS"
	// NonClaimsBasedPaymentTypeOther indicates an option not provided
	NonClaimsBasedPaymentTypeOther NonClaimsBasedPaymentType = "OTHER"
)

// PayRecipient is an enumeration of options for this category
type PayRecipient string

//goland:noinspection ALL
const (
	// PayRecipientProviders indicates the pay recipient is a provider
	PayRecipientProviders PayRecipient = "PROVIDERS"
	// PayRecipientBeneficiaries indicates the pay recipient is a beneficiary
	PayRecipientBeneficiaries PayRecipient = "BENEFICIARIES"
	// PayRecipientParticipants indicates the pay recipient is a participant
	PayRecipientParticipants PayRecipient = "PARTICIPANTS"
	// PayRecipientStates indicates the pay recipient is a state
	PayRecipientStates PayRecipient = "STATES"
	// PayRecipientOther indicates the pay recipient is not included in the provided options
	PayRecipientOther PayRecipient = "OTHER"
)

// PayType is the enumeration of options for this category
type PayType string

//goland:noinspection ALL
const (
	// PayTypeClaimsBasedPayments indicates a claims based payment type
	PayTypeClaimsBasedPayments PayType = "CLAIMS_BASED_PAYMENTS"
	// PayTypeNonClaimsBasedPayments indicates a non-claims based payment type
	PayTypeNonClaimsBasedPayments PayType = "NON_CLAIMS_BASED_PAYMENTS"
	// PayTypeGrants indicates payments will involve grants
	PayTypeGrants PayType = "GRANTS"
)

// PlanPayments defines the data associated with a plan payments model
type PlanPayments struct {
	baseTaskListSection

	// Page 1
	FundingSource                   pq.StringArray `json:"fundingSource" db:"funding_source" statusWeight:"1"`
	FundingSourceMedicareAInfo      *string        `json:"fundingSourceMedicareAInfo" db:"funding_source_medicare_a_info"`
	FundingSourceMedicareBInfo      *string        `json:"fundingSourceMedicareBInfo" db:"funding_source_medicare_b_info"`
	FundingSourceOther              *string        `json:"fundingSourceOther" db:"funding_source_other"`
	FundingSourceNote               *string        `json:"fundingSourceNote" db:"funding_source_note"`
	FundingSourceR                  pq.StringArray `json:"fundingSourceR" db:"funding_source_r" statusWeight:"1"`
	FundingSourceRMedicareAInfo     *string        `json:"fundingSourceRMedicareAInfo" db:"funding_source_r_medicare_a_info"`
	FundingSourceRMedicareBInfo     *string        `json:"fundingSourceRMedicareBInfo" db:"funding_source_r_medicare_b_info"`
	FundingSourceROther             *string        `json:"fundingSourceROther" db:"funding_source_r_other"`
	FundingSourceRNote              *string        `json:"fundingSourceRNote" db:"funding_source_r_note"`
	PayRecipients                   pq.StringArray `json:"payRecipients" db:"pay_recipients" statusWeight:"1"`
	PayRecipientsOtherSpecification *string        `json:"payRecipientsOtherSpecification" db:"pay_recipients_other_specification"`
	PayRecipientsNote               *string        `json:"payRecipientsNote" db:"pay_recipients_note"`
	PayType                         pq.StringArray `json:"payType" db:"pay_type" statusWeight:"1"`
	PayTypeNote                     *string        `json:"payTypeNote" db:"pay_type_note"`

	// Page 2
	PayClaims                               pq.StringArray `json:"payClaims" db:"pay_claims" statusWeight:"1"`
	PayClaimsOther                          *string        `json:"payClaimsOther" db:"pay_claims_other"`
	PayClaimsNote                           *string        `json:"payClaimsNote" db:"pay_claims_note"`
	ShouldAnyProvidersExcludedFFSSystems    *bool          `json:"shouldAnyProvidersExcludedFFSSystems" db:"should_any_providers_excluded_ffs_systems" statusWeight:"1"`
	ShouldAnyProviderExcludedFFSSystemsNote *string        `json:"shouldAnyProviderExcludedFFSSystemsNote" db:"should_any_providers_excluded_ffs_systems_note"`
	ChangesMedicarePhysicianFeeSchedule     *bool          `json:"changesMedicarePhysicianFeeSchedule" db:"changes_medicare_physician_fee_schedule" statusWeight:"1"`
	ChangesMedicarePhysicianFeeScheduleNote *string        `json:"changesMedicarePhysicianFeeScheduleNote" db:"changes_medicare_physician_fee_schedule_note"`
	AffectsMedicareSecondaryPayerClaims     *bool          `json:"affectsMedicareSecondaryPayerClaims" db:"affects_medicare_secondary_payer_claims" statusWeight:"1"`
	AffectsMedicareSecondaryPayerClaimsHow  *string        `json:"affectsMedicareSecondaryPayerClaimsHow" db:"affects_medicare_secondary_payer_claims_how"`
	AffectsMedicareSecondaryPayerClaimsNote *string        `json:"affectsMedicareSecondaryPayerClaimsNote" db:"affects_medicare_secondary_payer_claims_note"`
	PayModelDifferentiation                 *string        `json:"payModelDifferentiation" db:"pay_model_differentiation" statusWeight:"1"`

	// Page 3
	CreatingDependenciesBetweenServices     *bool   `json:"creatingDependenciesBetweenServices" db:"creating_dependencies_between_services" statusWeight:"1"`
	CreatingDependenciesBetweenServicesNote *string `json:"creatingDependenciesBetweenServicesNote" db:"creating_dependencies_between_services_note"`
	NeedsClaimsDataCollection               *bool   `json:"needsClaimsDataCollection" db:"needs_claims_data_collection" statusWeight:"1"`
	NeedsClaimsDataCollectionNote           *string `json:"needsClaimsDataCollectionNote" db:"needs_claims_data_collection_note"`
	ProvidingThirdPartyFile                 *bool   `json:"providingThirdPartyFile" db:"providing_third_party_file" statusWeight:"1"`
	IsContractorAwareTestDataRequirements   *bool   `json:"isContractorAwareTestDataRequirements" db:"is_contractor_aware_test_data_requirements" statusWeight:"1"`

	// Page 4
	BeneficiaryCostSharingLevelAndHandling          *string `json:"beneficiaryCostSharingLevelAndHandling" db:"beneficiary_cost_sharing_level_and_handling" statusWeight:"1"`
	WaiveBeneficiaryCostSharingForAnyServices       *bool   `json:"waiveBeneficiaryCostSharingForAnyServices" db:"waive_beneficiary_cost_sharing_for_any_services" statusWeight:"1"`
	WaiveBeneficiaryCostSharingServiceSpecification *string `json:"waiveBeneficiaryCostSharingServiceSpecification" db:"waive_beneficiary_cost_sharing_service_specification"`
	WaiverOnlyAppliesPartOfPayment                  *bool   `json:"waiverOnlyAppliesPartOfPayment" db:"waiver_only_applies_part_of_payment"`
	WaiveBeneficiaryCostSharingNote                 *string `json:"waiveBeneficiaryCostSharingNote" db:"waive_beneficiary_cost_sharing_note"`

	// Page 5
	NonClaimsPayments                               pq.StringArray `json:"nonClaimsPayments" db:"non_claims_payments" statusWeight:"1"`
	NonClaimsPaymentsOther                          *string        `json:"nonClaimsPaymentOther" db:"non_claims_payments_other"`
	NonClaimsPaymentsNote                           *string        `json:"nonClaimsPaymentsNote" db:"non_claims_payments_note"`
	PaymentCalculationOwner                         *string        `json:"paymentCalculationOwner" db:"payment_calculation_owner" statusWeight:"1"`
	NumberPaymentsPerPayCycle                       *string        `json:"numberPaymentsPerPayCycle" db:"number_payments_per_pay_cycle" statusWeight:"1"`
	NumberPaymentsPerPayCycleNote                   *string        `json:"numberPaymentsPerPayCycleNote" db:"number_payments_per_pay_cycle_note"`
	SharedSystemsInvolvedAdditionalClaimPayment     *bool          `json:"sharedSystemsInvolvedAdditionalClaimPayment" db:"shared_systems_involved_additional_claim_payment" statusWeight:"1"`
	SharedSystemsInvolvedAdditionalClaimPaymentNote *string        `json:"sharedSystemsInvolvedAdditionalClaimPaymentNote" db:"shared_systems_involved_additional_claim_payment_note"`
	PlanningToUseInnovationPaymentContractor        *bool          `json:"planningToUseInnovationPaymentContractor" db:"planning_to_use_innovation_payment_contractor" statusWeight:"1"`
	PlanningToUseInnovationPaymentContractorNote    *string        `json:"planningToUseInnovationPaymentContractorNote" db:"planning_to_use_innovation_payment_contractor_note"`

	// Page 6
	ExpectedCalculationComplexityLevel                *ComplexityCalculationLevelType `json:"expectedCalculationComplexityLevel" db:"expected_calculation_complexity_level" statusWeight:"1"`
	ExpectedCalculationComplexityLevelNote            *string                         `json:"expectedCalculationComplexityLevelNote" db:"expected_calculation_complexity_level_note"`
	ClaimsProcessingPrecedence                        *bool                           `json:"claimsProcessingPrecedence" db:"claims_processing_precedence"`
	ClaimsProcessingPrecedenceOther                   *string                         `json:"claimsProcessingPrecedenceOther" db:"claims_processing_precedence_other"`
	ClaimsProcessingPrecedenceNote                    *string                         `json:"claimsProcessingPrecedenceNote" db:"claims_processing_precedence_note"`
	CanParticipantsSelectBetweenPaymentMechanisms     *bool                           `json:"canParticipantsSelectBetweenPaymentMechanisms" db:"can_participants_select_between_payment_mechanisms" statusWeight:"1"`
	CanParticipantsSelectBetweenPaymentMechanismsHow  *string                         `json:"canParticipantsSelectBetweenPaymentMechanismsHow" db:"can_participants_select_between_payment_mechanisms_how"`
	CanParticipantsSelectBetweenPaymentMechanismsNote *string                         `json:"canParticipantsSelectBetweenPaymentMechanismsNote" db:"can_participants_select_between_payment_mechanisms_note"`
	AnticipatedPaymentFrequency                       pq.StringArray                  `json:"anticipatedPaymentFrequency" db:"anticipated_payment_frequency" statusWeight:"1"`
	AnticipatedPaymentFrequencyContinually            *string                         `json:"anticipatedPaymentFrequencyContinually" db:"anticipated_payment_frequency_continually"`
	AnticipatedPaymentFrequencyOther                  *string                         `json:"anticipatedPaymentFrequencyOther" db:"anticipated_payment_frequency_other"`
	AnticipatedPaymentFrequencyNote                   *string                         `json:"anticipatedPaymentFrequencyNote" db:"anticipated_payment_frequency_note"`

	// Page 7
	WillRecoverPayments                              *bool          `json:"willRecoverPayments" db:"will_recover_payments" statusWeight:"1"`
	WillRecoverPaymentsNote                          *string        `json:"willRecoverPaymentsNote" db:"will_recover_payments_note"`
	AnticipateReconcilingPaymentsRetrospectively     *bool          `json:"anticipateReconcilingPaymentsRetrospectively" db:"anticipate_reconciling_payments_retrospectively" statusWeight:"1"`
	AnticipateReconcilingPaymentsRetrospectivelyNote *string        `json:"anticipateReconcilingPaymentsRetrospectivelyNote" db:"anticipate_reconciling_payments_retrospectively_note"`
	PaymentReconciliationFrequency                   pq.StringArray `json:"paymentReconciliationFrequency" db:"payment_reconciliation_frequency" statusWeight:"1"`
	PaymentReconciliationFrequencyContinually        *string        `json:"paymentReconciliationFrequencyContinually" db:"payment_reconciliation_frequency_continually"`
	PaymentReconciliationFrequencyOther              *string        `json:"paymentReconciliationFrequencyOther" db:"payment_reconciliation_frequency_other"`
	PaymentReconciliationFrequencyNote               *string        `json:"paymentReconciliationFrequencyNote" db:"payment_reconciliation_frequency_note"`
	PaymentDemandRecoupmentFrequency                 pq.StringArray `json:"paymentDemandRecoupmentFrequency" db:"payment_demand_recoupment_frequency" statusWeight:"1"`
	PaymentDemandRecoupmentFrequencyContinually      *string        `json:"paymentDemandRecoupmentFrequencyContinually" db:"payment_demand_recoupment_frequency_continually"`
	PaymentDemandRecoupmentFrequencyOther            *string        `json:"paymentDemandRecoupmentFrequencyOther" db:"payment_demand_recoupment_frequency_other"`
	PaymentDemandRecoupmentFrequencyNote             *string        `json:"paymentDemandRecoupmentFrequencyNote" db:"payment_demand_recoupment_frequency_note"`
	PaymentStartDate                                 *time.Time     `json:"paymentStartDate" db:"payment_start_date" statusWeight:"1"`
	PaymentStartDateNote                             *string        `json:"paymentStartDateNote" db:"payment_start_date_note"`
}

// NewPlanPayments returns a new PlanPayments object
func NewPlanPayments(tls baseTaskListSection) *PlanPayments {
	return &PlanPayments{
		baseTaskListSection: tls,
	}
}
