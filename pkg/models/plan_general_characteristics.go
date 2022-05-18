package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// PlanGeneralCharacteristics represents the "general characteristics" section of a plan
type PlanGeneralCharacteristics struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	// Page 1
	IsNewModel                  *bool          `json:"isNewModel" db:"is_new_model"`
	ExistingModel               *string        `json:"existingModel" db:"existing_model"`
	ResemblesExistingModel      *bool          `json:"resemblesExistingModel" db:"resembles_existing_model"`
	ResemblesExistingModelWhich pq.StringArray `json:"resemblesExistingModelWhich" db:"resembles_existing_model_which"`
	ResemblesExistingModelHow   *string        `json:"resemblesExistingModelHow" db:"resembles_existing_model_how"`
	ResemblesExistingModelNote  *string        `json:"resemblesExistingModelNote" db:"resembles_existing_model_note"`
	HasComponentsOrTracks       *bool          `json:"hasComponentsOrTracks" db:"has_components_or_tracks"`
	HasComponentsOrTracksDiffer *string        `json:"hasComponentsOrTracksDiffer" db:"has_components_or_tracks_differ"`
	HasComponentsOrTracksNote   *string        `json:"hasComponentsOrTracksNote" db:"has_components_or_tracks_note"`

	// Page 2
	AlternativePaymentModel      *bool          `json:"alternativePaymentModel" db:"alternative_payment_model"`
	AlternativePaymentModelTypes pq.StringArray `json:"alternativePaymentModelTypes" db:"alternative_payment_model_types"`
	AlternativePaymentModelNote  *string        `json:"alternativePaymentModelNote" db:"alternative_payment_model_note"`
	KeyCharacteristics           pq.StringArray `json:"keyCharacteristics" db:"key_characteristics"`
	KeyCharacteristicsOther      *string        `json:"keyCharacteristicsOther" db:"key_characteristics_other"`
	CollectPlanBids              *bool          `json:"collectPlanBids" db:"collect_plan_bids"`
	CollectPlanBidsNote          *string        `json:"collectPlanBidsNote" db:"collect_plan_bids_note"`
	ManagePartCDEnrollment       *bool          `json:"managePartCDEnrollment" db:"manage_part_c_d_enrollment"`
	ManagePartCDEnrollmentNote   *string        `json:"managePartCDEnrollmentNote" db:"manage_part_c_d_enrollment_note"`
	PlanContactUpdated           *bool          `json:"planContactUpdated" db:"plan_contact_updated"`
	PlanContactUpdatedNote       *string        `json:"planContactUpdatedNote" db:"plan_contact_updated_note"`

	// Page 3
	CareCoordinationInvolved              *bool   `json:"careCoordinationInvolved" db:"care_coordination_involved"`
	CareCoordinationInvolvedDescription   *string `json:"careCoordinationInvolvedDescription" db:"care_coordination_involved_description"`
	CareCoordinationInvolvedNote          *string `json:"careCoordinationInvolvedNote" db:"care_coordination_involved_note"`
	AdditionalServicesInvolved            *bool   `json:"additionalServicesInvolved" db:"additional_services_involved"`
	AdditionalServicesInvolvedDescription *string `json:"additionalServicesInvolvedDescription" db:"additional_services_involved_description"`
	AdditionalServicesInvolvedNote        *string `json:"additionalServicesInvolvedNote" db:"additional_services_involved_note"`
	CommunityPartnersInvolved             *bool   `json:"communityPartnersInvolved" db:"community_partners_involved"`
	CommunityPartnersInvolvedDescription  *string `json:"communityPartnersInvolvedDescription" db:"community_partners_involved_description"`
	CommunityPartnersInvolvedNote         *string `json:"communityPartnersInvolvedNote" db:"community_partners_involved_note"`

	// Page 4
	GeographiesTargeted                       *bool          `json:"geographiesTargeted" db:"geographies_targeted"`
	GeographiesTargetedTypes                  pq.StringArray `json:"geographiesTargetedTypes" db:"geographies_targeted_types"`
	GeographiesTargetedTypesOther             *string        `json:"geographiesTargetedTypesOther" db:"geographies_targeted_types_other"`
	GeographiesTargetedAppliedTo              pq.StringArray `json:"geographiesTargetedAppliedTo" db:"geographies_targeted_applied_to"`
	GeographiesTargetedAppliedToOther         *string        `json:"geographiesTargetedAppliedToOther" db:"geographies_targeted_applied_to_other"`
	GeographiesTargetedNote                   *string        `json:"geographiesTargetedNote" db:"geographies_targeted_note"`
	ParticipationOptions                      *bool          `json:"participationOptions" db:"participation_options"`
	ParticipationOptionsNote                  *string        `json:"participationOptionsNote" db:"participation_options_note"`
	AgreementTypes                            pq.StringArray `json:"agreementTypes" db:"agreement_types"`
	AgreementTypesOther                       *string        `json:"agreementTypesOther" db:"agreement_types_other"`
	MultiplePatricipationAgreementsNeeded     *bool          `json:"multiplePatricipationAgreementsNeeded" db:"multiple_patricipation_agreements_needed"`
	MultiplePatricipationAgreementsNeededNote *string        `json:"multiplePatricipationAgreementsNeededNote" db:"multiple_patricipation_agreements_needed_note"`

	// Page 5
	RulemakingRequired            *bool          `json:"rulemakingRequired" db:"rulemaking_required"`
	RulemakingRequiredDescription *string        `json:"rulemakingRequiredDescription" db:"rulemaking_required_description"`
	RulemakingRequiredNote        *string        `json:"rulemakingRequiredNote" db:"rulemaking_required_note"`
	AuthorityAllowances           pq.StringArray `json:"authorityAllowances" db:"authority_allowances"`
	AuthorityAllowancesOther      *string        `json:"authorityAllowancesOther" db:"authority_allowances_other"`
	AuthorityAllowancesNote       *string        `json:"authorityAllowancesNote" db:"authority_allowances_note"`
	WaiversRequired               *bool          `json:"waiversRequired" db:"waivers_required"`
	WaiversRequiredTypes          pq.StringArray `json:"waiversRequiredTypes" db:"waivers_required_types"`
	WaiversRequiredNote           *string        `json:"waiversRequiredNote" db:"waivers_required_note"`

	// Meta
	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

// CalcStatus returns a TaskStatus based on how many fields have been entered in the PlanGeneralCharacteristics struct
func (gc *PlanGeneralCharacteristics) CalcStatus() {

	// TODO implement this. Doing it like this for now :)
	gc.Status = TaskReady

	//TODO look into making a generic function that takes in any parent class object and calcs status
	// fieldCount := 5
	// filledField := 0
	// decidedStat := TaskReady

	// if gc.ModelType != nil {
	// 	filledField++
	// }

	// if gc.Problem != nil {
	// 	filledField++
	// }
	// if gc.Goal != nil {
	// 	filledField++
	// }
	// if gc.TestInventions != nil {
	// 	filledField++
	// }
	// if gc.Note != nil {
	// 	filledField++
	// }

	// if filledField == fieldCount {
	// 	decidedStat = TaskComplete

	// } else if filledField > 0 {
	// 	decidedStat = TaskInProgress
	// }
	// gc.Status = decidedStat
}

// GetModelTypeName returns a string name that represents the PlanBasics struct
func (gc PlanGeneralCharacteristics) GetModelTypeName() string {
	return "Plan_General_Characteristics"
}

// GetID returns the ID property for a PlanBasics struct
func (gc PlanGeneralCharacteristics) GetID() uuid.UUID {
	return gc.ID
}

// GetPlanID returns the ModelPlanID property for a PlanBasics struct
func (gc PlanGeneralCharacteristics) GetPlanID() uuid.UUID {
	return gc.ModelPlanID
}

// GetModifiedBy returns the ModifiedBy property for a PlanBasics struct
func (gc PlanGeneralCharacteristics) GetModifiedBy() *string {
	return gc.ModifiedBy
}
