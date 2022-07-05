package models

import (
	"time"

	"github.com/lib/pq"

	"github.com/google/uuid"
)

// AnticipatedPaymentFrequencyType is the enumeration of options for this category
type AnticipatedPaymentFrequencyType string

//goland:noinspection ALL
const (
	// AnticipatedPaymentFrequencyTypeAnnually indicates annual payments
	AnticipatedPaymentFrequencyTypeAnnually AnticipatedPaymentFrequencyType = "ANNUALLY"
	// AnticipatedPaymentFrequencyTypeBiannually indicates biannual payments
	AnticipatedPaymentFrequencyTypeBiannually AnticipatedPaymentFrequencyType = "BIANNUALLY"
	// AnticipatedPaymentFrequencyTypeQuarterly indicates payments every quarter
	AnticipatedPaymentFrequencyTypeQuarterly AnticipatedPaymentFrequencyType = "QUARTERLY"
	// AnticipatedPaymentFrequencyTypeMonthly indicates payments every month
	AnticipatedPaymentFrequencyTypeMonthly AnticipatedPaymentFrequencyType = "MONTHLY"
	// AnticipatedPaymentFrequencyTypeSemiMonthly indicates semi-monthly payments
	AnticipatedPaymentFrequencyTypeSemiMonthly AnticipatedPaymentFrequencyType = "SEMI-MONTHLY"
	// AnticipatedPaymentFrequencyTypeWeekly indicates payments every week
	AnticipatedPaymentFrequencyTypeWeekly AnticipatedPaymentFrequencyType = "WEEKLY"
	// AnticipatedPaymentFrequencyTypeDaily indicates payments every day
	AnticipatedPaymentFrequencyTypeDaily AnticipatedPaymentFrequencyType = "DAILY"
	// AnticipatedPaymentFrequencyTypeOther indicates another form of payment than provided
	AnticipatedPaymentFrequencyTypeOther AnticipatedPaymentFrequencyType = "OTHER"
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
)

// FundingSource is an enumeration of options for this category
type FundingSource string

//goland:noinspection ALL
const (
	// FundingSourcePatientProtectionAffordableCareAct indicates the funding source is categorically patient protection affordable care act
	FundingSourcePatientProtectionAffordableCareAct FundingSource = "PATIENT_PROTECTION_AFFORDABLE_CARE_ACT"
	// FundingSourceTrustFund indicates the funding source is categorically trust fund
	FundingSourceTrustFund FundingSource = "TRUST_FUND"
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
	// NonClaimsBasedPaymentTypeGrants indicates grants
	NonClaimsBasedPaymentTypeGrants NonClaimsBasedPaymentType = "GRANTS"
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
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	// Page 1
	FundingSource                      pq.StringArray `json:"fundingSource" db:"funding_source" statusWeight:"1"`
	FundingSourceTrustFundDescription  *string        `json:"fundingSourceTrustFundDescription" db:"funding_source_trust_fund_description"`
	FundingSourceOtherDescription      *string        `json:"fundingSourceOtherDescription" db:"funding_source_other_description"`
	FundingSourceNote                  *string        `json:"fundingSourceNote" db:"funding_source_note"`
	FundingSourceR                     pq.StringArray `json:"fundingSourceR" db:"funding_source_r" statusWeight:"1"`
	FundingSourceRTrustFundDescription *string        `json:"fundingSourceRTrustFundDescription" db:"funding_source_r_trust_fund_description"`
	FundingSourceROtherDescription     *string        `json:"fundingSourceROtherDescription" db:"funding_source_r_other_description"`
	FundingSourceRNote                 *string        `json:"fundingSourceRNote" db:"funding_source_r_note"`
	PayRecipients                      pq.StringArray `json:"payRecipients" db:"pay_recipients" statusWeight:"1"`
	PayRecipientOtherSpecification     *string        `json:"payRecipientsOtherSpecification" db:"pay_recipients_other_specification"`
	PayRecipientsNote                  *string        `json:"payRecipientsNote" db:"pay_recipients_note"`
	PayType                            PayType        `json:"payType" db:"pay_type" statusWeight:"1"`
	PayTypeNote                        *string        `json:"payTypeNote" db:"pay_type_note"`

	// Page 2
	PayClaims                                      pq.StringArray `json:"payClaims" db:"pay_claims" statusWeight:"1"`
	PayClaimsOtherDescription                      *string        `json:"payClaimsOtherDescription" db:"pay_claims_other_description"`
	ShouldAnyProvidersExcludedFFSSystems           *bool          `json:"shouldAnyProvidersExcludedFFSSystems" db:"should_any_providers_excluded_ffs_systems" statusWeight:"1"`
	ShouldAnyProviderExcludedFFSSystemsNote        *string        `json:"shouldAnyProviderExcludedFFSSystemsNote" db:"should_any_providers_excluded_ffs_systems_note"`
	ChangesMedicarePhysicianFeeSchedule            *bool          `json:"changesMedicarePhysicianFeeSchedule" db:"changes_medicare_physician_fee_schedule" statusWeight:"1"`
	ChangesMedicarePhysicianFeeScheduleNote        *string        `json:"changesMedicarePhysicianFeeScheduleNote" db:"changes_medicare_physician_fee_schedule_note"`
	AffectsMedicareSecondaryPayerClaims            *bool          `json:"affectsMedicareSecondaryPayerClaims" db:"affects_medicare_secondary_payer_claims" statusWeight:"1"`
	AffectsMedicareSecondaryPayerClaimsExplanation *string        `json:"affectsMedicareSecondaryPayerClaimsExplanation" db:"affects_medicare_secondary_payer_claims_explanation"`
	AffectsMedicareSecondaryPayerClaimsNote        *string        `json:"affectsMedicareSecondaryPayerClaimsNote" db:"affects_medicare_secondary_payer_claims_note"`
	PayModelDifferentiation                        *string        `json:"payModelDifferentiation" db:"pay_model_differentiation" statusWeight:"1"`

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
	NonClaimsPaymentsOtherDescription               *string        `json:"nonClaimsPaymentOtherDescription" db:"non_claims_payments_other_description"`
	PaymentCalculationOwner                         *string        `json:"paymentCalculationOwner" db:"payment_calculation_owner" statusWeight:"1"`
	NumberPaymentsPerPayCycle                       *string        `json:"numberPaymentsPerPayCycle" db:"number_payments_per_pay_cycle" statusWeight:"1"`
	NumberPaymentsPerPayCycleNotes                  *string        `json:"numberPaymentsPerPayCycleNotes" db:"number_payments_per_pay_cycle_notes"`
	SharedSystemsInvolvedAdditionalClaimPayment     *bool          `json:"sharedSystemsInvolvedAdditionalClaimPayment" db:"shared_systems_involved_additional_claim_payment" statusWeight:"1"`
	SharedSystemsInvolvedAdditionalClaimPaymentNote *string        `json:"sharedSystemsInvolvedAdditionalClaimPaymentNote" db:"shared_systems_involved_additional_claim_payment_note"`
	PlanningToUseInnovationPaymentContractor        *bool          `json:"planningToUseInnovationPaymentContractor" db:"planning_to_use_innovation_payment_contractor" statusWeight:"1"`
	PlanningToUseInnovationPaymentContractorNote    *string        `json:"planningToUseInnovationPaymentContractorNote" db:"planning_to_use_innovation_payment_contractor_note"`
	FundingStructureDescription                     *string        `json:"fundingStructureDescription" db:"funding_structure_description" statusWeight:"1"`

	// Page 6
	ExpectedCalculationComplexityLevel                       ComplexityCalculationLevelType  `json:"expectedCalculationComplexityLevel" db:"expected_calculation_complexity_level" statusWeight:"1"`
	ExpectedCalculationComplexityLevelNote                   *string                         `json:"expectedCalculationComplexityLevelNote" db:"expected_calculation_complexity_level_note"`
	CanParticipantsSelectBetweenPaymentMechanisms            *bool                           `json:"canParticipantsSelectBetweenPaymentMechanisms" db:"can_participants_select_between_payment_mechanisms" statusWeight:"1"`
	CanParticipantsSelectBetweenPaymentMechanismsDescription *string                         `json:"canParticipantsSelectBetweenPaymentMechanismsDescription" db:"can_participants_select_between_payment_mechanisms_description"`
	CanParticipantsSelectBetweenPaymentMechanismsNote        *string                         `json:"canParticipantsSelectBetweenPaymentMechanismsNote" db:"can_participants_select_between_payment_mechanisms_note"`
	AnticipatedPaymentFrequency                              AnticipatedPaymentFrequencyType `json:"anticipatedPaymentFrequency" db:"anticipated_payment_frequency" statusWeight:"1"`
	AnticipatedPaymentFrequencyOtherDescription              *string                         `json:"anticipatedPaymentFrequencyOtherDescription" db:"anticipated_payment_frequency_other_description"`
	AnticipatedPaymentFrequencyNotes                         *string                         `json:"anticipatedPaymentFrequencyNotes" db:"anticipated_payment_frequency_notes"`

	// Page 7
	WillRecoverPayments                               *bool      `json:"willRecoverPayments" db:"will_recover_payments" statusWeight:"1"`
	WillRecoverPaymentsNotes                          *string    `json:"willRecoverPaymentsNotes" db:"will_recover_payments_notes"`
	AnticipateReconcilingPaymentsRetrospectively      *bool      `json:"anticipateReconcilingPaymentsRetrospectively" db:"anticipate_reconciling_payments_retrospectively" statusWeight:"1"`
	AnticipateReconcilingPaymentsRetrospectivelyNotes *string    `json:"anticipateReconcilingPaymentsRetrospectivelyNotes" db:"anticipate_reconciling_payments_retrospectively_notes"`
	PaymentStartDate                                  *time.Time `json:"paymentStartDate" db:"payment_start_date" statusWeight:"1"`
	PaymentStartDateNotes                             *string    `json:"paymentStartDateNotes" db:"payment_start_date_notes"`

	// Meta
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

// GetModelTypeName provides the PlanPayments model type name
func (p PlanPayments) GetModelTypeName() string {
	return "Plan_Payments"
}

// GetID provides the PlanPayments ID
func (p PlanPayments) GetID() uuid.UUID {
	return p.ID
}

// GetPlanID provides the PlanPayments associated model plan ID
func (p PlanPayments) GetPlanID() uuid.UUID {
	return p.ModelPlanID
}

// GetCreatedBy provides the CreatedBy field
func (p PlanPayments) GetCreatedBy() string {
	return p.CreatedBy
}

// GetModifiedBy provides the ModifiedBy field
func (p PlanPayments) GetModifiedBy() *string {
	return p.ModifiedBy
}

// CalcStatus calculates the status of the Plan Payments and sets the Status field
func (p *PlanPayments) CalcStatus() error {
	status, err := GenericallyCalculateStatus(p)
	if err != nil {
		return err
	}

	p.Status = status
	return nil
}
