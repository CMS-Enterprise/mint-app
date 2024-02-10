package models

import (
	"time"
)

// ExistingModel represents an existing innovation model that is already in use
type ExistingModel struct {
	ID        int    `json:"id" db:"id"`
	ModelName string `json:"modelName" db:"model_name"`
	Stage     string `json:"stage" db:"stage"`
	createdByRelation
	modifiedByRelation

	NumberOfParticipants          *string    `json:"numberOfParticipants" db:"number_of_participants"`
	Category                      *string    `json:"category" db:"category"`
	Authority                     *string    `json:"authority" db:"authority"`
	Description                   *string    `json:"description" db:"description"`
	NumberOfBeneficiariesImpacted *int       `json:"numberOfBeneficiariesImpacted" db:"number_of_beneficiaries_impacted"`
	NumberOfPhysiciansImpacted    *int       `json:"numberOfPhysiciansImpacted" db:"number_of_physicians_impacted"`
	DateBegan                     *time.Time `json:"dateBegan" db:"date_began"`
	DateEnded                     *time.Time `json:"dateEnded" db:"date_ended"`
	States                        *string    `json:"states" db:"states"`
	Keywords                      *string    `json:"keywords" db:"keywords"`
	URL                           *string    `json:"url" db:"url"`
	DisplayModelSummary           *bool      `json:"displayModelSummary" db:"display_model_summary"`
}

func (m ExistingModel) isLinkedExistingModel() {}
