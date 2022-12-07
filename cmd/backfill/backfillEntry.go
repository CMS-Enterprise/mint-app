package main

import "github.com/cmsgov/mint-app/pkg/models"

// TranslationError represents an issue translating a field
type TranslationError struct {
	Translation Translation
	Value       interface{}
	Message     string
}

// BackfillEntry represents a logical collection of
type BackfillEntry struct {
	ModelPlan                    *models.ModelPlan
	PlanBasics                   *models.PlanBasics
	PlanGeneralCharacteristics   *models.PlanGeneralCharacteristics
	PlanParticipantsAndProviders *models.PlanParticipantsAndProviders
	PlanBeneficiaries            *models.PlanBeneficiaries
	PlanOpsEvalAndLearning       *models.PlanOpsEvalAndLearning
	PlanPayments                 *models.PlanPayments
	Collaborators                []*models.PlanCollaborator
	Errors                       []TranslationError
}

// NewBackFillEntry instantiates a BackfillEntry
func NewBackFillEntry() BackfillEntry {

	return BackfillEntry{
		ModelPlan:                    &models.ModelPlan{},
		PlanBasics:                   &models.PlanBasics{},
		PlanGeneralCharacteristics:   &models.PlanGeneralCharacteristics{},
		PlanParticipantsAndProviders: &models.PlanParticipantsAndProviders{},
		PlanBeneficiaries:            &models.PlanBeneficiaries{},
		PlanOpsEvalAndLearning:       &models.PlanOpsEvalAndLearning{},
		PlanPayments:                 &models.PlanPayments{},
		Errors:                       []TranslationError{},
	}
}
