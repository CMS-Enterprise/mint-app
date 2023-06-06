package models

import (
	"github.com/lib/pq"
)

// PlanGeneralCharacteristics represents the "general characteristics" section of a plan
type PlanGeneralCharacteristics struct {
	baseTaskListSection
	DemoCode          *string `json:"demoCode" db:"demo_code"`
	AmsModelID        *string `json:"amsModelID" db:"ams_model_id"`
	ModelAbbreviation *string `json:"modelAbbreviation" db:"model_abbreviation"`

	// Page 1
	IsNewModel                  *bool   `json:"isNewModel" db:"is_new_model" statusWeight:"1"`
	ExistingModel               *string `json:"existingModel" db:"existing_model"`
	ResemblesExistingModel      *bool   `json:"resemblesExistingModel" db:"resembles_existing_model" statusWeight:"1"`
	ResemblesExistingModelHow   *string `json:"resemblesExistingModelHow" db:"resembles_existing_model_how"`
	ResemblesExistingModelNote  *string `json:"resemblesExistingModelNote" db:"resembles_existing_model_note"`
	HasComponentsOrTracks       *bool   `json:"hasComponentsOrTracks" db:"has_components_or_tracks" statusWeight:"1"`
	HasComponentsOrTracksDiffer *string `json:"hasComponentsOrTracksDiffer" db:"has_components_or_tracks_differ"`
	HasComponentsOrTracksNote   *string `json:"hasComponentsOrTracksNote" db:"has_components_or_tracks_note"`

	// Page 2
	AlternativePaymentModelTypes pq.StringArray `json:"alternativePaymentModelTypes" db:"alternative_payment_model_types"`
	AlternativePaymentModelNote  *string        `json:"alternativePaymentModelNote" db:"alternative_payment_model_note"`
	KeyCharacteristics           pq.StringArray `json:"keyCharacteristics" db:"key_characteristics"`
	KeyCharacteristicsOther      *string        `json:"keyCharacteristicsOther" db:"key_characteristics_other"`
	KeyCharacteristicsNote       *string        `json:"keyCharacteristicsNote" db:"key_characteristics_note"`
	CollectPlanBids              *bool          `json:"collectPlanBids" db:"collect_plan_bids"`
	CollectPlanBidsNote          *string        `json:"collectPlanBidsNote" db:"collect_plan_bids_note"`
	ManagePartCDEnrollment       *bool          `json:"managePartCDEnrollment" db:"manage_part_c_d_enrollment"`
	ManagePartCDEnrollmentNote   *string        `json:"managePartCDEnrollmentNote" db:"manage_part_c_d_enrollment_note"`
	PlanContractUpdated          *bool          `json:"planContractUpdated" db:"plan_contract_updated"`
	PlanContractUpdatedNote      *string        `json:"planContractUpdatedNote" db:"plan_contract_updated_note"`

	// Page 3
	CareCoordinationInvolved              *bool   `json:"careCoordinationInvolved" db:"care_coordination_involved" statusWeight:"1"`
	CareCoordinationInvolvedDescription   *string `json:"careCoordinationInvolvedDescription" db:"care_coordination_involved_description"`
	CareCoordinationInvolvedNote          *string `json:"careCoordinationInvolvedNote" db:"care_coordination_involved_note"`
	AdditionalServicesInvolved            *bool   `json:"additionalServicesInvolved" db:"additional_services_involved" statusWeight:"1"`
	AdditionalServicesInvolvedDescription *string `json:"additionalServicesInvolvedDescription" db:"additional_services_involved_description"`
	AdditionalServicesInvolvedNote        *string `json:"additionalServicesInvolvedNote" db:"additional_services_involved_note"`
	CommunityPartnersInvolved             *bool   `json:"communityPartnersInvolved" db:"community_partners_involved" statusWeight:"1"`
	CommunityPartnersInvolvedDescription  *string `json:"communityPartnersInvolvedDescription" db:"community_partners_involved_description"`
	CommunityPartnersInvolvedNote         *string `json:"communityPartnersInvolvedNote" db:"community_partners_involved_note"`

	// Page 4
	GeographiesTargeted                       *bool          `json:"geographiesTargeted" db:"geographies_targeted" statusWeight:"1"`
	GeographiesTargetedTypes                  pq.StringArray `json:"geographiesTargetedTypes" db:"geographies_targeted_types"`
	GeographiesTargetedTypesOther             *string        `json:"geographiesTargetedTypesOther" db:"geographies_targeted_types_other"`
	GeographiesTargetedAppliedTo              pq.StringArray `json:"geographiesTargetedAppliedTo" db:"geographies_targeted_applied_to"`
	GeographiesTargetedAppliedToOther         *string        `json:"geographiesTargetedAppliedToOther" db:"geographies_targeted_applied_to_other"`
	GeographiesTargetedNote                   *string        `json:"geographiesTargetedNote" db:"geographies_targeted_note"`
	ParticipationOptions                      *bool          `json:"participationOptions" db:"participation_options" statusWeight:"1"`
	ParticipationOptionsNote                  *string        `json:"participationOptionsNote" db:"participation_options_note"`
	AgreementTypes                            pq.StringArray `json:"agreementTypes" db:"agreement_types"`
	AgreementTypesOther                       *string        `json:"agreementTypesOther" db:"agreement_types_other"`
	MultiplePatricipationAgreementsNeeded     *bool          `json:"multiplePatricipationAgreementsNeeded" db:"multiple_patricipation_agreements_needed"`
	MultiplePatricipationAgreementsNeededNote *string        `json:"multiplePatricipationAgreementsNeededNote" db:"multiple_patricipation_agreements_needed_note"`

	// Page 5
	RulemakingRequired            *bool          `json:"rulemakingRequired" db:"rulemaking_required" statusWeight:"1"`
	RulemakingRequiredDescription *string        `json:"rulemakingRequiredDescription" db:"rulemaking_required_description"`
	RulemakingRequiredNote        *string        `json:"rulemakingRequiredNote" db:"rulemaking_required_note"`
	AuthorityAllowances           pq.StringArray `json:"authorityAllowances" db:"authority_allowances"`
	AuthorityAllowancesOther      *string        `json:"authorityAllowancesOther" db:"authority_allowances_other"`
	AuthorityAllowancesNote       *string        `json:"authorityAllowancesNote" db:"authority_allowances_note"`
	WaiversRequired               *bool          `json:"waiversRequired" db:"waivers_required" statusWeight:"1"`
	WaiversRequiredTypes          pq.StringArray `json:"waiversRequiredTypes" db:"waivers_required_types"`
	WaiversRequiredNote           *string        `json:"waiversRequiredNote" db:"waivers_required_note"`
}

// NewPlanGeneralCharacteristics returns a new GeneralCharacteristics object
func NewPlanGeneralCharacteristics(tls baseTaskListSection) *PlanGeneralCharacteristics {
	return &PlanGeneralCharacteristics{
		baseTaskListSection: tls,
	}
}
