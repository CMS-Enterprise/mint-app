package models

import (
	"github.com/lib/pq"
	"time"

	"github.com/cmsgov/mint-app/pkg/models/anticipatedpaymentfrequencytype"
	"github.com/cmsgov/mint-app/pkg/models/complexitycalculationleveltype"
	"github.com/cmsgov/mint-app/pkg/models/paytype"

	"github.com/google/uuid"
)

// PlanPayments defines the data associated with a plan payments model
type PlanPayments struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	// Page 1
	FundingSource                      pq.StringArray  `json:"fundingSource" db:"funding_source"`
	FundingSourceTrustFundDescription  *string         `json:"fundingSourceTrustFundDescription" db:"funding_source_trust_fund_description"`
	FundingSourceOtherDescription      *string         `json:"fundingSourceOtherDescription" db:"funding_source_other_description"`
	FundingSourceNote                  *string         `json:"fundingSourceNote" db:"funding_source_note"`
	FundingSourceR                     pq.StringArray  `json:"fundingSourceR" db:"funding_source_r"`
	FundingSourceRTrustFundDescription *string         `json:"fundingSourceRTrustFundDescription" db:"funding_source_r_trust_fund_description"`
	FundingSourceROtherDescription     *string         `json:"fundingSourceROtherDescription" db:"funding_source_r_other_description"`
	FundingSourceRNote                 *string         `json:"fundingSourceRNote" db:"funding_source_r_note"`
	PayRecipients                      pq.StringArray  `json:"payRecipients" db:"pay_recipients"`
	PayRecipientOtherSpecification     *string         `json:"payRecipientsOtherSpecification" db:"pay_recipients_other_specification"`
	PayRecipientsNote                  *string         `json:"payRecipientsNote" db:"pay_recipients_note"`
	PayType                            paytype.PayType `json:"payType" db:"pay_type"`
	PayTypeNote                        *string         `json:"payTypeNote" db:"pay_type_note"`

	// Page 2
	PayClaims                                      pq.StringArray `json:"payClaims" db:"pay_claims"`
	PayClaimsOtherDescription                      *string        `json:"payClaimsOtherDescription" db:"pay_claims_other_description"`
	ShouldAnyProvidersExcludedFFSSystems           *bool          `json:"shouldAnyProvidersExcludedFFSSystems" db:"should_any_providers_excluded_ffs_systems"`
	ShouldAnyProviderExcludedFFSSystemsNote        *string        `json:"shouldAnyProviderExcludedFFSSystemsNote" db:"should_any_providers_excluded_ffs_systems_note"`
	ChangesMedicarePhysicianFeeSchedule            *bool          `json:"changesMedicarePhysicianFeeSchedule" db:"changes_medicare_physician_fee_schedule"`
	ChangesMedicarePhysicianFeeScheduleNote        *string        `json:"changesMedicarePhysicianFeeScheduleNote" db:"changes_medicare_physician_fee_schedule_note"`
	AffectsMedicareSecondaryPayerClaims            *bool          `json:"affectsMedicareSecondaryPayerClaims" db:"affects_medicare_secondary_payer_claims"`
	AffectsMedicareSecondaryPayerClaimsExplanation *string        `json:"affectsMedicareSecondaryPayerClaimsExplanation" db:"affects_medicare_secondary_payer_claims_explanation"`
	AffectsMedicareSecondaryPayerClaimsNote        *string        `json:"affectsMedicareSecondaryPayerClaimsNote" db:"affects_medicare_secondary_payer_claims_note"`
	PayModelDifferentiation                        *string        `json:"payModelDifferentiation" db:"pay_model_differentiation"`

	// Page 3
	CreatingDependenciesBetweenServices     *bool   `json:"creatingDependenciesBetweenServices" db:"creating_dependencies_between_services"`
	CreatingDependenciesBetweenServicesNote *string `json:"creatingDependenciesBetweenServicesNote" db:"creating_dependencies_between_services_note"`
	NeedsClaimsDataCollection               *bool   `json:"needsClaimsDataCollection" db:"needs_claims_data_collection"`
	NeedsClaimsDataCollectionNote           *string `json:"needsClaimsDataCollectionNote" db:"needs_claims_data_collection_note"`
	ProvidingThirdPartyFile                 *bool   `json:"providingThirdPartyFile" db:"providing_third_party_file"`
	IsContractorAwareTestDataRequirements   *bool   `json:"isContractorAwareTestDataRequirements" db:"is_contractor_aware_test_data_requirements"`

	// Page 4
	BeneficiaryCostSharingLevelAndHandling          *string `json:"beneficiaryCostSharingLevelAndHandling" db:"beneficiary_cost_sharing_level_and_handling"`
	WaiveBeneficiaryCostSharingForAnyServices       *bool   `json:"waiveBeneficiaryCostSharingForAnyServices" db:"waive_beneficiary_cost_sharing_for_any_services"`
	WaiveBeneficiaryCostSharingServiceSpecification *string `json:"waiveBeneficiaryCostSharingServiceSpecification" db:"waive_beneficiary_cost_sharing_service_specification"`
	WaiverOnlyAppliesPartOfPayment                  *bool   `json:"waiverOnlyAppliesPartOfPayment" db:"waiver_only_applies_part_of_payment"`
	WaiveBeneficiaryCostSharingNote                 *string `json:"waiveBeneficiaryCostSharingNote" db:"waive_beneficiary_cost_sharing_note"`

	// Page 5
	NonClaimsPayments                               pq.StringArray `json:"nonClaimsPayments" db:"non_claims_payments"`
	NonClaimsPaymentsOtherDescription               *string        `json:"nonClaimsPaymentOtherDescription" db:"non_claims_payments_other_description"`
	PaymentCalculationOwner                         *string        `json:"paymentCalculationOwner" db:"payment_calculation_owner"`
	NumberPaymentsPerPayCycle                       *string        `json:"numberPaymentsPerPayCycle" db:"number_payments_per_pay_cycle"`
	NumberPaymentsPerPayCycleNotes                  *string        `json:"numberPaymentsPerPayCycleNotes" db:"number_payments_per_pay_cycle_notes"`
	SharedSystemsInvolvedAdditionalClaimPayment     *bool          `json:"sharedSystemsInvolvedAdditionalClaimPayment" db:"shared_systems_involved_additional_claim_payment"`
	SharedSystemsInvolvedAdditionalClaimPaymentNote *string        `json:"sharedSystemsInvolvedAdditionalClaimPaymentNote" db:"shared_systems_involved_additional_claim_payment_note"`
	PlanningToUseInnovationPaymentContractor        *bool          `json:"planningToUseInnovationPaymentContractor" db:"planning_to_use_innovation_payment_contractor"`
	PlanningToUseInnovationPaymentContractorNote    *string        `json:"planningToUseInnovationPaymentContractorNote" db:"planning_to_use_innovation_payment_contractor_note"`
	FundingCenterDescription                        *string        `json:"fundingCenterDescription" db:"funding_center_description"`

	// Page 6
	ExpectedCalculationComplexityLevel                       complexitycalculationleveltype.ComplexityCalculationLevelType   `json:"expectedCalculationComplexityLevel" db:"expected_calculation_complexity_level"`
	ExpectedCalculationComplexityLevelNote                   *string                                                         `json:"expectedCalculationComplexityLevelNote" db:"expected_calculation_complexity_level_note"`
	CanParticipantsSelectBetweenPaymentMechanisms            *bool                                                           `json:"canParticipantsSelectBetweenPaymentMechanisms" db:"can_participants_select_between_payment_mechanisms"`
	CanParticipantsSelectBetweenPaymentMechanismsDescription *string                                                         `json:"canParticipantsSelectBetweenPaymentMechanismsDescription" db:"can_participants_select_between_payment_mechanisms_description"`
	CanParticipantsSelectBetweenPaymentMechanismsNote        *string                                                         `json:"canParticipantsSelectBetweenPaymentMechanismsNote" db:"can_participants_select_between_payment_mechanisms_note"`
	AnticipatedPaymentFrequency                              anticipatedpaymentfrequencytype.AnticipatedPaymentFrequencyType `json:"anticipatedPaymentFrequency" db:"anticipated_payment_frequency"`
	AnticipatedPaymentFrequencyOtherDescription              *string                                                         `json:"anticipatedPaymentFrequencyOtherDescription" db:"anticipated_payment_frequency_other_description"`
	AnticipatedPaymentFrequencyNotes                         *string                                                         `json:"anticipatedPaymentFrequencyNotes" db:"anticipated_payment_frequency_notes"`

	// Page 7
	WillRecoverPayments                               *bool      `json:"willRecoverPayments" db:"will_recover_payments"`
	WillRecoverPaymentsNotes                          *string    `json:"willRecoverPaymentsNotes" db:"will_recover_payments_notes"`
	AnticipateReconcilingPaymentsRetrospectively      *bool      `json:"anticipateReconcilingPaymentsRetrospectively" db:"anticipate_reconciling_payments_retrospectively"`
	AnticipateReconcilingPaymentsRetrospectivelyNotes *string    `json:"anticipateReconcilingPaymentsRetrospectivelyNotes" db:"anticipate_reconciling_payments_retrospectively_notes"`
	PaymentStartDate                                  *time.Time `json:"paymentStartDate" db:"payment_start_date"`
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
func (p PlanPayments) CalcStatus() error {
	status, err := GenericallyCalculateStatus(p)
	if err != nil {
		return err
	}

	p.Status = status
	return nil
}
