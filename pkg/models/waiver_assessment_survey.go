package models

import "github.com/google/uuid"

// WaiverAssessmentSurveyStatus represents the work completion status of a waiver assessment survey
type WaiverAssessmentSurveyStatus string

// These constants represent the different values of WaiverAssessmentSurveyStatus
const (
	WaiverAssessmentSurveyStatusReady      WaiverAssessmentSurveyStatus = "READY"
	WaiverAssessmentSurveyStatusInProgress WaiverAssessmentSurveyStatus = "IN_PROGRESS"
	WaiverAssessmentSurveyStatusComplete   WaiverAssessmentSurveyStatus = "COMPLETE"
)

// WaiverAssessmentSurvey represents the waiver assessment questionnaire for a model plan
type WaiverAssessmentSurvey struct {
	baseStruct
	modelPlanRelation

	// Page 3 - Medicare payment waivers
	ModifiesMedicareSavingsPrograms        *bool   `json:"modifiesMedicareSavingsPrograms" db:"modifies_medicare_savings_programs"`
	ModifiesMedicareSavingsProgramsExample *string `json:"modifiesMedicareSavingsProgramsExample" db:"modifies_medicare_savings_programs_example"`
	ModifiesMedicareSavingsProgramsNote    *string `json:"modifiesMedicareSavingsProgramsNote" db:"modifies_medicare_savings_programs_note"`
	BundlesPayments                        *bool   `json:"bundlesPayments" db:"bundles_payments"`
	BundlesPaymentsExample                 *string `json:"bundlesPaymentsExample" db:"bundles_payments_example"`
	BundlesPaymentsNote                    *string `json:"bundlesPaymentsNote" db:"bundles_payments_note"`
	OffersRiskSharingArrangements          *bool   `json:"offersRiskSharingArrangements" db:"offers_risk_sharing_arrangements"`
	OffersRiskSharingArrangementsExample   *string `json:"offersRiskSharingArrangementsExample" db:"offers_risk_sharing_arrangements_example"`
	OffersRiskSharingArrangementsNote      *string `json:"offersRiskSharingArrangementsNote" db:"offers_risk_sharing_arrangements_note"`

	// Page 4 - Program waivers (Medicare Benefit Enhancements)
	ImpactsSiteOfCarePayments                              *bool   `json:"impactsSiteOfCarePayments" db:"impacts_site_of_care_payments"`
	ImpactsSiteOfCarePaymentsExample                       *string `json:"impactsSiteOfCarePaymentsExample" db:"impacts_site_of_care_payments_example"`
	ImpactsSiteOfCarePaymentsNote                          *string `json:"impactsSiteOfCarePaymentsNote" db:"impacts_site_of_care_payments_note"`
	ModifiesCareTeamScopeOfPractice                        *bool   `json:"modifiesCareTeamScopeOfPractice" db:"modifies_care_team_scope_of_practice"`
	ModifiesCareTeamScopeOfPracticeExample                 *string `json:"modifiesCareTeamScopeOfPracticeExample" db:"modifies_care_team_scope_of_practice_example"`
	ModifiesCareTeamScopeOfPracticeNote                    *string `json:"modifiesCareTeamScopeOfPracticeNote" db:"modifies_care_team_scope_of_practice_note"`
	ModifiesCareDeliveryWithClaimsBasedPayments            *bool   `json:"modifiesCareDeliveryWithClaimsBasedPayments" db:"modifies_care_delivery_with_claims_based_payments"`
	ModifiesCareDeliveryWithClaimsBasedPaymentsExample     *string `json:"modifiesCareDeliveryWithClaimsBasedPaymentsExample" db:"modifies_care_delivery_with_claims_based_payments_example"`
	ModifiesCareDeliveryWithClaimsBasedPaymentsNote        *string `json:"modifiesCareDeliveryWithClaimsBasedPaymentsNote" db:"modifies_care_delivery_with_claims_based_payments_note"`
	ModifiesQualityMeasurementsOrPaymentsViaWaivers        *bool   `json:"modifiesQualityMeasurementsOrPaymentsViaWaivers" db:"modifies_quality_measurements_or_payments_via_waivers"`
	ModifiesQualityMeasurementsOrPaymentsViaWaiversExample *string `json:"modifiesQualityMeasurementsOrPaymentsViaWaiversExample" db:"modifies_quality_measurements_or_payments_via_waivers_example"`
	ModifiesQualityMeasurementsOrPaymentsViaWaiversNote    *string `json:"modifiesQualityMeasurementsOrPaymentsViaWaiversNote" db:"modifies_quality_measurements_or_payments_via_waivers_note"`

	// Page 5 - Medicaid payment waivers
	ImpactsMedicaidOnlyBeneficiaries                *bool   `json:"impactsMedicaidOnlyBeneficiaries" db:"impacts_medicaid_only_beneficiaries"`
	ImpactsMedicaidOnlyBeneficiariesExample         *string `json:"impactsMedicaidOnlyBeneficiariesExample" db:"impacts_medicaid_only_beneficiaries_example"`
	ImpactsMedicaidOnlyBeneficiariesNote            *string `json:"impactsMedicaidOnlyBeneficiariesNote" db:"impacts_medicaid_only_beneficiaries_note"`
	ImpactsHomeCommunityBasedServicePayments        *bool   `json:"impactsHomeCommunityBasedServicePayments" db:"impacts_home_community_based_service_payments"`
	ImpactsHomeCommunityBasedServicePaymentsExample *string `json:"impactsHomeCommunityBasedServicePaymentsExample" db:"impacts_home_community_based_service_payments_example"`
	ImpactsHomeCommunityBasedServicePaymentsNote    *string `json:"impactsHomeCommunityBasedServicePaymentsNote" db:"impacts_home_community_based_service_payments_note"`
	ImpactsManagedCareWaivers                       *bool   `json:"impactsManagedCareWaivers" db:"impacts_managed_care_waivers"`
	ImpactsManagedCareWaiversExample                *string `json:"impactsManagedCareWaiversExample" db:"impacts_managed_care_waivers_example"`
	ImpactsManagedCareWaiversNote                   *string `json:"impactsManagedCareWaiversNote" db:"impacts_managed_care_waivers_note"`
	AdditionalMedicaidSpecificWaivers               *string `json:"additionalMedicaidSpecificWaivers" db:"additional_medicaid_specific_waivers"`

	Status WaiverAssessmentSurveyStatus `json:"status" db:"status"`
}

// IsComplete returns whether the waiver assessment survey has been marked as complete
func (w *WaiverAssessmentSurvey) IsComplete() bool {
	return w.Status == WaiverAssessmentSurveyStatusComplete
}

// NewWaiverAssessmentSurvey returns a new WaiverAssessmentSurvey object
func NewWaiverAssessmentSurvey(createdBy uuid.UUID, modelPlanID uuid.UUID) *WaiverAssessmentSurvey {
	return &WaiverAssessmentSurvey{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Status:            WaiverAssessmentSurveyStatusReady,
	}
}
