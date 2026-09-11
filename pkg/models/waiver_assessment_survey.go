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

type NotSelectedReason string

const (
	NotSelectedReasonOutOfScope         NotSelectedReason = "OUT_OF_SCOPE"
	NotSelectedReasonOverlaps           NotSelectedReason = "OVERLAPS"
	NotSelectedReasonNotTesting         NotSelectedReason = "NOT_TESTING"
	NotSelectedReasonNotEngaged         NotSelectedReason = "NOT_ENGAGED"
	NotSelectedReasonFeedbackAgainstUse NotSelectedReason = "FEEDBACK_AGAINST_USE"
	NotSelectedReasonOther              NotSelectedReason = "OTHER"
)

// WaiverAssessmentSurvey represents the waiver assessment questionnaire for a model plan
type WaiverAssessmentSurvey struct {
	baseStruct
	modelPlanRelation
	completedByRelation

	// Page 3 - Medicare payment waivers
	ModifiesMedicareSavingsPrograms        *bool              `json:"modifiesMedicareSavingsPrograms" db:"modifies_medicare_savings_programs"`
	ModifiesMedicareSavingsProgramsExample *string            `json:"modifiesMedicareSavingsProgramsExample" db:"modifies_medicare_savings_programs_example"`
	ModifiesMedicareSavingsProgramsWhyNot  *NotSelectedReason `json:"modifiesMedicareSavingsProgramsWhyNot" db:"modifies_medicare_savings_programs_why_not"`
	BundlesPayments                        *bool              `json:"bundlesPayments" db:"bundles_payments"`
	BundlesPaymentsExample                 *string            `json:"bundlesPaymentsExample" db:"bundles_payments_example"`
	BundlesPaymentsWhyNot                  *NotSelectedReason `json:"bundlesPaymentsWhyNot" db:"bundles_payments_why_not"`
	OffersRiskSharingArrangements          *bool              `json:"offersRiskSharingArrangements" db:"offers_risk_sharing_arrangements"`
	OffersRiskSharingArrangementsExample   *string            `json:"offersRiskSharingArrangementsExample" db:"offers_risk_sharing_arrangements_example"`
	OffersRiskSharingArrangementsWhyNot    *NotSelectedReason `json:"offersRiskSharingArrangementsWhyNot" db:"offers_risk_sharing_arrangements_why_not"`

	// Page 4 - Program waivers (Medicare Benefit Enhancements)
	ImpactsSiteOfCarePayments                              *bool              `json:"impactsSiteOfCarePayments" db:"impacts_site_of_care_payments"`
	ImpactsSiteOfCarePaymentsExample                       *string            `json:"impactsSiteOfCarePaymentsExample" db:"impacts_site_of_care_payments_example"`
	ImpactsSiteOfCarePaymentsWhyNot                        *NotSelectedReason `json:"impactsSiteOfCarePaymentsWhyNot" db:"impacts_site_of_care_payments_why_not"`
	ModifiesCareTeamScopeOfPractice                        *bool              `json:"modifiesCareTeamScopeOfPractice" db:"modifies_care_team_scope_of_practice"`
	ModifiesCareTeamScopeOfPracticeExample                 *string            `json:"modifiesCareTeamScopeOfPracticeExample" db:"modifies_care_team_scope_of_practice_example"`
	ModifiesCareTeamScopeOfPracticeWhyNot                  *NotSelectedReason `json:"modifiesCareTeamScopeOfPracticeWhyNot" db:"modifies_care_team_scope_of_practice_why_not"`
	ModifiesCareDeliveryWithClaimsBasedPayments            *bool              `json:"modifiesCareDeliveryWithClaimsBasedPayments" db:"modifies_care_delivery_with_claims_based_payments"`
	ModifiesCareDeliveryWithClaimsBasedPaymentsExample     *string            `json:"modifiesCareDeliveryWithClaimsBasedPaymentsExample" db:"modifies_care_delivery_with_claims_based_payments_example"`
	ModifiesCareDeliveryWithClaimsBasedPaymentsWhyNot      *NotSelectedReason `json:"modifiesCareDeliveryWithClaimsBasedPaymentsWhyNot" db:"modifies_care_delivery_with_claims_based_payments_why_not"`
	ModifiesQualityMeasurementsOrPaymentsViaWaivers        *bool              `json:"modifiesQualityMeasurementsOrPaymentsViaWaivers" db:"modifies_quality_measurements_or_payments_via_waivers"`
	ModifiesQualityMeasurementsOrPaymentsViaWaiversExample *string            `json:"modifiesQualityMeasurementsOrPaymentsViaWaiversExample" db:"modifies_quality_measurements_or_payments_via_waivers_example"`
	ModifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot  *NotSelectedReason `json:"modifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot" db:"modifies_quality_measurements_or_payments_via_waivers_why_not"`

	// Page 5 - Medicaid payment waivers
	ImpactsMedicaidOnlyBeneficiaries                *bool              `json:"impactsMedicaidOnlyBeneficiaries" db:"impacts_medicaid_only_beneficiaries"`
	ImpactsMedicaidOnlyBeneficiariesExample         *string            `json:"impactsMedicaidOnlyBeneficiariesExample" db:"impacts_medicaid_only_beneficiaries_example"`
	ImpactsMedicaidOnlyBeneficiariesWhyNot          *NotSelectedReason `json:"impactsMedicaidOnlyBeneficiariesWhyNot" db:"impacts_medicaid_only_beneficiaries_why_not"`
	ImpactsHomeCommunityBasedServicePayments        *bool              `json:"impactsHomeCommunityBasedServicePayments" db:"impacts_home_community_based_service_payments"`
	ImpactsHomeCommunityBasedServicePaymentsExample *string            `json:"impactsHomeCommunityBasedServicePaymentsExample" db:"impacts_home_community_based_service_payments_example"`
	ImpactsHomeCommunityBasedServicePaymentsWhyNot  *NotSelectedReason `json:"impactsHomeCommunityBasedServicePaymentsWhyNot" db:"impacts_home_community_based_service_payments_why_not"`
	ImpactsManagedCareWaivers                       *bool              `json:"impactsManagedCareWaivers" db:"impacts_managed_care_waivers"`
	ImpactsManagedCareWaiversExample                *string            `json:"impactsManagedCareWaiversExample" db:"impacts_managed_care_waivers_example"`
	ImpactsManagedCareWaiversWhyNot                 *NotSelectedReason `json:"impactsManagedCareWaiversWhyNot" db:"impacts_managed_care_waivers_why_not"`
	AdditionalMedicaidSpecificWaivers               *string            `json:"additionalMedicaidSpecificWaivers" db:"additional_medicaid_specific_waivers"`

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
