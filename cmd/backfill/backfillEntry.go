package main

import (
	"log"

	"github.com/cmsgov/mint-app/pkg/models"
)

// TranslationError represents an issue translating a field
type TranslationError struct {
	Translation Translation
	Type        string
	Value       interface{}
	Message     string
}

// UploadError represents an error with Uploading data to the database
type UploadError struct {
	Model   string
	Field   string
	Value   interface{}
	Message string
	DBError interface{}
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
	TErrors                      []TranslationError
	UErrors                      []UploadError
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
		TErrors:                      []TranslationError{},
		UErrors:                      []UploadError{},
	}
}

func (e *BackfillEntry) addNonNullUError(uErr *UploadError) {
	if uErr != nil {
		e.UErrors = append(e.UErrors, *uErr)
		log.Default().Print("Issue uploading data for model section: ", uErr.Model, ". Message: ", uErr.Message)
	}
}
