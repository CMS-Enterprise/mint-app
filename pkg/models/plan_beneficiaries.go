package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

//PlanBeneficiaries represents the beneficiaries section of the model plan task list
type PlanBeneficiaries struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	//page 1
	Beneficiaries                         pq.StringArray  `json:"beneficiaries" db:"beneficiaries"`
	BeneficiariesOther                    *string         `json:"beneficiariesOther" db:"beneficiaries_other"`
	BeneficiariesNote                     *string         `json:"beneficiariesNote" db:"beneficiaries_note"`
	TreatDualElligibleDifferent           *TriStateAnswer `json:"treatDualElligibleDifferent" db:"treat_dual_elligible_different" statusWeight:"1"`
	TreatDualElligibleDifferentHow        *string         `json:"treatDualElligibleDifferentHow" db:"treat_dual_elligible_different_how"`
	TreatDualElligibleDifferentNote       *string         `json:"treatDualElligibleDifferentNote" db:"treat_dual_elligible_different_note"`
	ExcludeCertainCharacteristics         *TriStateAnswer `json:"excludeCertainCharacteristics" db:"exclude_certain_characteristics"  statusWeight:"1"`
	ExcludeCertainCharacteristicsCriteria *string         `json:"excludeCertainCharacteristicsCriteria" db:"exclude_certain_characteristics_criteria"`
	ExcludeCertainCharacteristicsNote     *string         `json:"excludeCertainCharacteristicsNote" db:"exclude_certain_characteristics_note"`

	// Page 2
	NumberPeopleImpacted       *int            `json:"numberPeopleImpacted" db:"number_people_impacted" statusWeight:"1"`
	EstimateConfidence         *ConfidenceType `json:"estimateConfidence" db:"estimate_confidence" statusWeight:"1"`
	ConfidenceNote             *string         `json:"confidenceNote" db:"confidence_note"`
	BeneficiarySelectionMethod pq.StringArray  `json:"beneficiarySelectionMethod" db:"beneficiary_selection_method"`
	BeneficiarySelectionOther  *string         `json:"beneficiarySelectionOther" db:"beneficiary_selection_other"`
	BeneficiarySelectionNote   *string         `json:"beneficiarySelectionNote" db:"beneficiary_selection_note"`

	// Page 3
	BeneficiarySelectionFrequency      *FrequencyType `json:"beneficiarySelectionFrequency" db:"beneficiary_selection_frequency" statusWeight:"1"`
	BeneficiarySelectionFrequencyOther *string        `json:"beneficiarySelectionFrequencyOther" db:"beneficiary_selection_frequency_other"`
	BeneficiarySelectionFrequencyNote  *string        `json:"beneficiarySelectionFrequencyNote" db:"beneficiary_selection_frequency_note"`
	BeneficiaryOverlap                 *OverlapType   `json:"beneficiaryOverlap" db:"beneficiary_overlap" statusWeight:"1"`
	BeneficiaryOverlapNote             *string        `json:"beneficiaryOverlapNote" db:"beneficiary_overlap_note"`
	PrecedenceRules                    *string        `json:"precedenceRules" db:"precedence_rules"`

	// Meta
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

// CalcStatus returns a TaskStatus based on how many fields have been entered in the PlanBeneficiaries struct
func (b *PlanBeneficiaries) CalcStatus() error {
	status, err := GenericallyCalculateStatus(*b)
	if err != nil {
		return err
	}

	b.Status = status
	return nil

}

// GetModelTypeName returns the name of the model
func (b PlanBeneficiaries) GetModelTypeName() string {
	return "Plan_Beneficiaries"
}

// GetID returns the ID property for a PlanBeneficiaries struct
func (b PlanBeneficiaries) GetID() uuid.UUID {
	return b.ID
}

// GetPlanID returns the ModelPlanID property for a PlanBeneficiaries struct
func (b PlanBeneficiaries) GetPlanID() uuid.UUID {
	return b.ModelPlanID
}

// GetModifiedBy returns the ModifiedBy property for a PlanBeneficiaries struct
func (b PlanBeneficiaries) GetModifiedBy() *string {
	return b.ModifiedBy
}

// GetCreatedBy returns the ModifiedBy property for a PlanBeneficiaries struct
func (b PlanBeneficiaries) GetCreatedBy() string {
	return b.CreatedBy
}

//OverlapType represents the possible Overlap Type answers
type OverlapType string

//These constants represent the possible OverLap Type values
const (
	OverlapYesNeedPolicies OverlapType = "YES_NEED_POLICIES"
	OverlapYesNoIssues     OverlapType = "YES_NO_ISSUES"
	OverlapNo              OverlapType = "NO"
)
