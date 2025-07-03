package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// PlanGeneralCharacteristics represents the "general characteristics" section of a plan
type PlanGeneralCharacteristics struct {
	baseTaskListSection

	// Page 1
	IsNewModel         *bool      `json:"isNewModel" db:"is_new_model" statusWeight:"1"`
	CurrentModelPlanID *uuid.UUID `json:"currentModelPlanID" db:"current_model_plan_id"`
	ExistingModelID    *int       `json:"existingModelID" db:"existing_model_id"`

	// Resemble existing model questions
	ResemblesExistingModel              *YesNoOtherType `json:"resemblesExistingModel" db:"resembles_existing_model" statusWeight:"1"`
	ResemblesExistingModelWhyHow        *string         `json:"resemblesExistingModelWhyHow" db:"resembles_existing_model_why_how" statusWeight:"1"`
	ResemblesExistingModelOtherSpecify  *string         `json:"resemblesExistingModelOtherSpecify" db:"resembles_existing_model_other_specify" statusWeight:"1"`
	ResemblesExistingModelOtherSelected *bool           `json:"resemblesExistingModelOtherSelected" db:"resembles_existing_model_other_selected" statusWeight:"1"`
	ResemblesExistingModelOtherOption   *string         `json:"resemblesExistingModelOtherOption" db:"resembles_existing_model_other_option" statusWeight:"1"`
	ResemblesExistingModelHow           *string         `json:"resemblesExistingModelHow" db:"resembles_existing_model_how"`
	ResemblesExistingModelNote          *string         `json:"resemblesExistingModelNote" db:"resembles_existing_model_note"`

	// Particpation in model questions
	ParticipationInModelPrecondition              *YesNoOtherType `json:"participationInModelPrecondition" db:"participation_in_model_precondition"`
	ParticipationInModelPreconditionWhyHow        *string         `json:"participationInModelPreconditionWhyHow" db:"participation_in_model_precondition_why_how"`
	ParticipationInModelPreconditionOtherSpecify  *string         `json:"participationInModelPreconditionOtherSpecify" db:"participation_in_model_precondition_other_specify"`
	ParticipationInModelPreconditionOtherSelected *bool           `json:"participationInModelPreconditionOtherSelected" db:"participation_in_model_precondition_other_selected"`
	ParticipationInModelPreconditionOtherOption   *string         `json:"participationInModelPreconditionOtherOption" db:"participation_in_model_precondition_other_option"`
	ParticipationInModelPreconditionNote          *string         `json:"participationInModelPreconditionNote" db:"participation_in_model_precondition_note"`

	HasComponentsOrTracks       *bool   `json:"hasComponentsOrTracks" db:"has_components_or_tracks" statusWeight:"1"`
	HasComponentsOrTracksDiffer *string `json:"hasComponentsOrTracksDiffer" db:"has_components_or_tracks_differ"`
	HasComponentsOrTracksNote   *string `json:"hasComponentsOrTracksNote" db:"has_components_or_tracks_note"`

	// Page 2
	PhasedIn                     *bool          `json:"phasedIn" db:"phased_in" statusWeight:"1"` //default to false
	PhasedInNote                 *string        `json:"phasedInNote" db:"phased_in_note"`
	AgencyOrStateHelp            pq.StringArray `json:"agencyOrStateHelp" db:"agency_or_state_help"`
	AgencyOrStateHelpOther       *string        `json:"agencyOrStateHelpOther" db:"agency_or_state_help_other"`
	AgencyOrStateHelpNote        *string        `json:"agencyOrStateHelpNote" db:"agency_or_state_help_note"`
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
	GeographiesStatesAndTerritories           pq.StringArray `json:"geographiesStatesAndTerritories" db:"geographies_states_and_territories"`
	GeographiesRegionTypes                    pq.StringArray `json:"geographiesRegionTypes" db:"geographies_region_types"`
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

// StatesAndTerritories represents the possible values for the "States and Territories" field
type StatesAndTerritories string

// These constants represent the different values of StatesAndTerritories
const (
	StatesAndTerritoriesAL StatesAndTerritories = "AL"
	StatesAndTerritoriesAK StatesAndTerritories = "AK"
	StatesAndTerritoriesAZ StatesAndTerritories = "AZ"
	StatesAndTerritoriesAR StatesAndTerritories = "AR"
	StatesAndTerritoriesCA StatesAndTerritories = "CA"
	StatesAndTerritoriesCO StatesAndTerritories = "CO"
	StatesAndTerritoriesCT StatesAndTerritories = "CT"
	StatesAndTerritoriesDE StatesAndTerritories = "DE"
	StatesAndTerritoriesDC StatesAndTerritories = "DC"
	StatesAndTerritoriesFL StatesAndTerritories = "FL"
	StatesAndTerritoriesGA StatesAndTerritories = "GA"
	StatesAndTerritoriesHI StatesAndTerritories = "HI"
	StatesAndTerritoriesID StatesAndTerritories = "ID"
	StatesAndTerritoriesIL StatesAndTerritories = "IL"
	StatesAndTerritoriesIN StatesAndTerritories = "IN"
	StatesAndTerritoriesIA StatesAndTerritories = "IA"
	StatesAndTerritoriesKS StatesAndTerritories = "KS"
	StatesAndTerritoriesKY StatesAndTerritories = "KY"
	StatesAndTerritoriesLA StatesAndTerritories = "LA"
	StatesAndTerritoriesME StatesAndTerritories = "ME"
	StatesAndTerritoriesMD StatesAndTerritories = "MD"
	StatesAndTerritoriesMA StatesAndTerritories = "MA"
	StatesAndTerritoriesMI StatesAndTerritories = "MI"
	StatesAndTerritoriesMN StatesAndTerritories = "MN"
	StatesAndTerritoriesMS StatesAndTerritories = "MS"
	StatesAndTerritoriesMO StatesAndTerritories = "MO"
	StatesAndTerritoriesMT StatesAndTerritories = "MT"
	StatesAndTerritoriesNE StatesAndTerritories = "NE"
	StatesAndTerritoriesNV StatesAndTerritories = "NV"
	StatesAndTerritoriesNH StatesAndTerritories = "NH"
	StatesAndTerritoriesNJ StatesAndTerritories = "NJ"
	StatesAndTerritoriesNM StatesAndTerritories = "NM"
	StatesAndTerritoriesNY StatesAndTerritories = "NY"
	StatesAndTerritoriesNC StatesAndTerritories = "NC"
	StatesAndTerritoriesND StatesAndTerritories = "ND"
	StatesAndTerritoriesOH StatesAndTerritories = "OH"
	StatesAndTerritoriesOK StatesAndTerritories = "OK"
	StatesAndTerritoriesOR StatesAndTerritories = "OR"
	StatesAndTerritoriesPA StatesAndTerritories = "PA"
	StatesAndTerritoriesRI StatesAndTerritories = "RI"
	StatesAndTerritoriesSC StatesAndTerritories = "SC"
	StatesAndTerritoriesSD StatesAndTerritories = "SD"
	StatesAndTerritoriesTN StatesAndTerritories = "TN"
	StatesAndTerritoriesTX StatesAndTerritories = "TX"
	StatesAndTerritoriesUT StatesAndTerritories = "UT"
	StatesAndTerritoriesVT StatesAndTerritories = "VT"
	StatesAndTerritoriesVA StatesAndTerritories = "VA"
	StatesAndTerritoriesWA StatesAndTerritories = "WA"
	StatesAndTerritoriesWV StatesAndTerritories = "WV"
	StatesAndTerritoriesWI StatesAndTerritories = "WI"
	StatesAndTerritoriesWY StatesAndTerritories = "WY"
	StatesAndTerritoriesAS StatesAndTerritories = "AS"
	StatesAndTerritoriesGU StatesAndTerritories = "GU"
	StatesAndTerritoriesMP StatesAndTerritories = "MP"
	StatesAndTerritoriesPR StatesAndTerritories = "PR"
	StatesAndTerritoriesUM StatesAndTerritories = "UM"
	StatesAndTerritoriesVI StatesAndTerritories = "VI"
)

// GeographyRegionType represents the possible values for the "Geography Region Type" field
type GeographyRegionType string

// These constants represent the different values of GeographyRegionType
const (
	GeographyRegionTypeCBSA GeographyRegionType = "CBSA"
	GeographyRegionTypeHRR  GeographyRegionType = "HRR"
	GeographyRegionTypeMSA  GeographyRegionType = "MSA"
)
