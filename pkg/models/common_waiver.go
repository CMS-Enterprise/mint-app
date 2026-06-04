package models

import "github.com/google/uuid"

// CommonWaiver represents a waiver type in the CMMI waiver library
type CommonWaiver struct {
	baseStruct

	Name                               string  `json:"name" db:"name"`
	Description                        *string `json:"description" db:"description"`
	ParticipationAgreementLanguageLink *string `json:"participationAgreementLanguageLink" db:"participation_agreement_language_link"`
	CmmiWaiverPointOfContact           *string `json:"cmmiWaiverPointOfContact" db:"cmmi_waiver_point_of_contact"`
	WaiverType                         *string `json:"waiverType" db:"waiver_type"`
	WaiverFocus                        *string `json:"waiverFocus" db:"waiver_focus"`
	WhatIsWaived                       *string `json:"whatIsWaived" db:"what_is_waived"`
	HasStandardizationEffort           *bool   `json:"hasStandardizationEffort" db:"has_standardization_effort"`
	HasClaimsDataOrRREGAnalysis        *string `json:"hasClaimsDataOrRREGAnalysis" db:"has_claims_data_or_rreg_analysis"`
	IsUsedInActiveModels               *bool   `json:"isUsedInActiveModels" db:"is_used_in_active_models"`
	// SurveyQuestionField is the waiver_assessment_survey DB column name that drives suggestion
	// eligibility. Nil means always suggested. Set via migration when real waiver mapping arrives.
	SurveyQuestionField *string `json:"surveyQuestionField" db:"survey_question_field"`

	// These fields facilitate queries but are not actual columns on the mto_common_milestone table.
	// They are populated via JOINs when querying in the context of a model plan.
	ModelPlanID   *uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	WillUseWaiver *bool      `json:"willUseWaiver" db:"will_use_waiver"`
	IsSuggested   *bool      `json:"isSuggested" db:"is_suggested"`
}

// IsAnswered returns true if the waiver has been answered (i.e. willUseWaiver is not nil)
func (c CommonWaiver) IsAnswered() bool {
	return c.WillUseWaiver != nil
}

// NewCommonWaiver returns a new CommonWaiver object
func NewCommonWaiver(createdBy uuid.UUID, name string) *CommonWaiver {
	return &CommonWaiver{
		baseStruct: NewBaseStruct(createdBy),
		Name:       name,
	}
}
