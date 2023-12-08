package models

import (
	"github.com/lib/pq"
)

// PlanBeneficiaries represents the beneficiaries section of the model plan task list
type PlanBeneficiaries struct {
	baseTaskListSection

	//page 1
	Beneficiaries                         pq.StringArray  `json:"beneficiaries" db:"beneficiaries"`
	BeneficiariesOther                    *string         `json:"beneficiariesOther" db:"beneficiaries_other"`
	BeneficiariesNote                     *string         `json:"beneficiariesNote" db:"beneficiaries_note"`
	DiseaseSpecificGroup                  *string         `json:"diseaseSpecificGroup" db:"disease_specific_group"`
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
	PrecedenceRules                    pq.StringArray `json:"precedenceRules" db:"precedence_rules"`
	PrecedenceRulesYes                 *string        `json:"precedenceRulesYes" db:"precedence_rules_yes"`
	PrecedenceRulesNo                  *string        `json:"precedenceRulesNo" db:"precedence_rules_no"`
	PrecedenceRulesNote                *string        `json:"precedenceRulesNote" db:"precedence_rules_note"`
}

// NewPlanBeneficiaries returns a new plan Beneficiaries
func NewPlanBeneficiaries(tls baseTaskListSection) *PlanBeneficiaries {
	return &PlanBeneficiaries{
		baseTaskListSection: tls,
	}
}

// YesNoFilter represents the yes no filter type
type YesNoFilter string

// These constants represent the yes no filter types
const (
	YesNoFilterYes YesNoFilter = "YES"
	YesNoFilterNo  YesNoFilter = "NO"
)
