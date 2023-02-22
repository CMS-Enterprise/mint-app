package models

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
)

// baseStructUserTable represents the shared data in common betwen all models
// this struct will replace baseStruct, and be renamed baseStruct once all data objects get migrated to use the user table
type baseStructUserTable struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	CreatedBy   uuid.UUID  `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// NewBaseStructUser returns a base struct User object
func NewBaseStructUser(createdBy uuid.UUID) baseStructUserTable {
	return baseStructUserTable{
		CreatedBy: createdBy,
	}
}
func (b *baseStructUserTable) SetModifiedBy(principal authentication.Principal) error {

	userID := principal.Account().ID

	b.ModifiedBy = &userID
	return nil
}

// GetID returns the ID property for a PlanBasics struct
func (b baseStructUserTable) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for an i base struct
func (b baseStructUserTable) GetModifiedBy() *string {

	if b.ModifiedBy == nil {
		return nil
	}

	if *b.ModifiedBy == uuid.Nil {
		return nil
	}

	retString := b.ModifiedBy.String()
	return &retString

}

// GetCreatedBy implements the CreatedBy property
func (b baseStructUserTable) GetCreatedBy() string {
	return b.CreatedBy.String()
}

// CreatedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (b *baseStructUserTable) CreatedByUserAccount(ctx context.Context) *authentication.UserAccount {

	service := appcontext.UserAccountService(ctx)
	account, _ := service(ctx, b.CreatedBy)
	return account

}

// ModifiedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (b *baseStructUserTable) ModifiedByUserAccount(ctx context.Context) *authentication.UserAccount {

	if b.ModifiedBy == nil {
		return nil
	}
	service := appcontext.UserAccountService(ctx)
	// service := authentication.UserAccountService(ctx)
	account, _ := service(ctx, *b.ModifiedBy)
	return account

}
