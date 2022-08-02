package models

import (
	"github.com/lib/pq"
)

//PlanBeneficiaries represents the beneficiaries section of the model plan task list
type PlanBeneficiaries struct {
	BaseTaskListSection

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
}
