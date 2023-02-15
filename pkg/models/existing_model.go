package models

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
)

// ExistingModel represents an existing innovation model that is already in use
type ExistingModel struct {
	ID        string `json:"id" db:"id"`
	ModelName string `json:"modelName" db:"model_name"`
	Stage     string `json:"stage" db:"stage"`

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

	CreatedBy   uuid.UUID  `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// CreatedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (eM *ExistingModel) CreatedByUserAccount(ctx context.Context) *authentication.UserAccount {

	service := appcontext.UserAccountService(ctx)
	account, _ := service(ctx, eM.CreatedBy)
	return account

}

// ModifiedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (eM *ExistingModel) ModifiedByUserAccount(ctx context.Context) *authentication.UserAccount {

	if eM.ModifiedBy == nil {
		return nil
	}
	service := appcontext.UserAccountService(ctx)
	// service := authentication.UserAccountService(ctx)
	account, _ := service(ctx, *eM.ModifiedBy)
	return account

}
