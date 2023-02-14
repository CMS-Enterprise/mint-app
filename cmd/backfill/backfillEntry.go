package main

import (
	"log"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

// TranslationError represents an issue translating a field
type TranslationError struct {
	Translation Translation
	Type        string
	Value       interface{}
	Message     string
}

// UploadWorklist represents information and data to be handled in a worklist manually
type UploadWorklist struct {
	TranslationError
	ModelName   string
	ModelPlanID uuid.UUID
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
	SimplifiedCollaborators      []*SimplifiedCollaborator
	Collaborators                []*models.PlanCollaborator
	TErrors                      []TranslationError
	UErrors                      []UploadError
}

// SimplifiedCollaborator representes information needed to generate a collaborator before knowing if a user account exists
type SimplifiedCollaborator struct {
	Role models.TeamRole
	Name string
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

func (e *BackfillEntry) convertTErrorsToWorklistEntries() []UploadWorklist {
	wklist := []UploadWorklist{}

	for _, tErr := range e.TErrors {
		wklistEntry := e.convertTErrorToWorklistEntry(tErr)
		wklist = append(wklist, wklistEntry)
	}
	return wklist
}

func (e *BackfillEntry) convertTErrorToWorklistEntry(tErr TranslationError) UploadWorklist {

	wklistEntry := UploadWorklist{
		TranslationError: tErr,
		ModelName:        e.ModelPlan.ModelName,
		ModelPlanID:      e.ModelPlan.ID,
	}
	return wklistEntry
}
