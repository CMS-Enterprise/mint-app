package models

import (
	"strings"

	"github.com/google/uuid"
)

// CommonWaiverType represents the category of a waiver in the CMMI waiver library
type CommonWaiverType string

// CommonWaiverFocus represents an area addressed by a waiver.
type CommonWaiverFocus string

// CommonWaiverType values
const (
	CommonWaiverTypeFraudAbuse        CommonWaiverType = "FRAUD_ABUSE"
	CommonWaiverTypeMedicaidPayment   CommonWaiverType = "MEDICAID_PAYMENT"
	CommonWaiverTypeMedicarePayment   CommonWaiverType = "MEDICARE_PAYMENT"
	CommonWaiverTypeProgramMedicareBE CommonWaiverType = "PROGRAM_MEDICARE_BE"
	CommonWaiverTypeUnknown           CommonWaiverType = "UNKNOWN"
)

// WaiverFocusDisplay returns the waiver's focus areas as a comma-separated string.
func (c CommonWaiver) WaiverFocusDisplay() string {
	labels := make([]string, len(c.WaiverFocus))
	for i, focus := range c.WaiverFocus {
		labels[i] = focus.DisplayName()
	}
	return strings.Join(labels, ", ")
}

// CommonWaiverFocus values
const (
	CommonWaiverFocusAdministrativeOperational           CommonWaiverFocus = "ADMINISTRATIVE_OPERATIONAL"
	CommonWaiverFocusAntiKickback                        CommonWaiverFocus = "ANTI_KICKBACK"
	CommonWaiverFocusBeneficiaryEngagementCostSharing    CommonWaiverFocus = "BENEFICIARY_ENGAGEMENT_COST_SHARING"
	CommonWaiverFocusBeneficiaryEngagementIncentives     CommonWaiverFocus = "BENEFICIARY_ENGAGEMENT_INCENTIVES"
	CommonWaiverFocusHospitalFacilityRelated             CommonWaiverFocus = "HOSPITAL_FACILITY_RELATED"
	CommonWaiverFocusPatientEngagementIncentives         CommonWaiverFocus = "PATIENT_ENGAGEMENT_INCENTIVES"
	CommonWaiverFocusPaymentFinancialArrangement         CommonWaiverFocus = "PAYMENT_FINANCIAL_ARRANGEMENT"
	CommonWaiverFocusPaymentSystemsRateAdjustments       CommonWaiverFocus = "PAYMENT_SYSTEMS_RATE_ADJUSTMENTS"
	CommonWaiverFocusSafeHarbors                         CommonWaiverFocus = "SAFE_HARBORS"
	CommonWaiverFocusScopeOfPractice                     CommonWaiverFocus = "SCOPE_OF_PRACTICE"
	CommonWaiverFocusSharedDecisionMakingPatientServices CommonWaiverFocus = "SHARED_DECISION_MAKING_PATIENT_SERVICES"
	CommonWaiverFocusSiteOfCare                          CommonWaiverFocus = "SITE_OF_CARE"
)

// commonWaiverFocusDisplayNames maps common waiver focuses to their user-facing labels.
var commonWaiverFocusDisplayNames = map[CommonWaiverFocus]string{
	CommonWaiverFocusAdministrativeOperational:           "Administrative and operational",
	CommonWaiverFocusAntiKickback:                        "Anti-kickback",
	CommonWaiverFocusBeneficiaryEngagementCostSharing:    "Beneficiary engagement and cost sharing",
	CommonWaiverFocusBeneficiaryEngagementIncentives:     "Beneficiary engagement incentives",
	CommonWaiverFocusHospitalFacilityRelated:             "Hospital and facility-related waiver",
	CommonWaiverFocusPatientEngagementIncentives:         "Patient engagement incentives",
	CommonWaiverFocusPaymentFinancialArrangement:         "Payment and financial arrangement",
	CommonWaiverFocusPaymentSystemsRateAdjustments:       "Payment systems and rate adjustments",
	CommonWaiverFocusSafeHarbors:                         "Safe harbors",
	CommonWaiverFocusScopeOfPractice:                     "Scope of practice",
	CommonWaiverFocusSharedDecisionMakingPatientServices: "Shared decision-making and patient services",
	CommonWaiverFocusSiteOfCare:                          "Site of care",
}

// DisplayName returns the user-facing label for a common waiver focus.
func (f CommonWaiverFocus) DisplayName() string {
	if name, ok := commonWaiverFocusDisplayNames[f]; ok {
		return name
	}
	return string(f)
}

// CommonWaiver represents a waiver type in the CMMI waiver library
type CommonWaiver struct {
	baseStruct

	Name                               string                       `json:"name" db:"name"`
	Description                        string                       `json:"description" db:"description"`
	ParticipationAgreementLanguageLink *string                      `json:"participationAgreementLanguageLink" db:"participation_agreement_language_link"`
	WaiverType                         *CommonWaiverType            `json:"waiverType" db:"waiver_type"`
	WaiverFocus                        EnumArray[CommonWaiverFocus] `json:"waiverFocus" db:"waiver_focus"`
	WhatIsWaived                       string                       `json:"whatIsWaived" db:"what_is_waived"`
	HasStandardizationEffort           bool                         `json:"hasStandardizationEffort" db:"has_standardization_effort"`
	HasClaimsDataOrRREGAnalysis        string                       `json:"hasClaimsDataOrRREGAnalysis" db:"has_claims_data_or_rreg_analysis"`
	IsUsedInActiveModels               bool                         `json:"isUsedInActiveModels" db:"is_used_in_active_models"`
	// SurveyQuestionField is the waiver_assessment_survey DB column name that drives suggestion
	// eligibility.
	SurveyQuestionField string `json:"surveyQuestionField" db:"survey_question_field"`

	// These fields facilitate queries but are not actual columns on the common_waiver table.
	// They are populated via JOINs when querying in the context of a model plan.
	ModelPlanID   *uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	WillUseWaiver *bool      `json:"willUseWaiver" db:"will_use_waiver"`
	// Using reason comes from the waiver table. It is exposed here for convenience
	UsingReason *string `json:"usingReason" db:"using_reason"`
	// Not using reason comes from the waiver table. It is exposed here for convenience
	NotUsingReason *string `json:"notUsingReason" db:"not_using_reason"`
	// SuggestedWaiverID is the ID of the suggested_waiver row for this waiver+model plan,
	// or nil if the waiver is not currently suggested.
	SuggestedWaiverID *uuid.UUID `json:"suggestedWaiverID" db:"suggested_waiver_id"`
}

// IsAnswered returns true if the waiver has been answered (i.e. willUseWaiver is not nil)
func (c CommonWaiver) IsAnswered() bool {
	return c.WillUseWaiver != nil
}

// IsSuggested returns true if the waiver is suggested (i.e. SuggestedWaiverID is not nil)
func (c CommonWaiver) IsSuggested() bool {
	return c.SuggestedWaiverID != nil
}

// A waiver is unused if it is not answered and not suggested
func (c CommonWaiver) IsUnused() bool {
	return !c.IsAnswered() && !c.IsSuggested()
}

// NewCommonWaiver returns a new CommonWaiver object
func NewCommonWaiver(createdBy uuid.UUID, name string) *CommonWaiver {
	return &CommonWaiver{
		baseStruct: NewBaseStruct(createdBy),
		Name:       name,
	}
}
