package models

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
)

// IBaseStruct is an interface that all models must implement
type IBaseStruct interface {
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
	SetModifiedBy(principal authentication.Principal) error
}

// baseStruct represents the shared data in common betwen all models
type baseStruct struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	CreatedBy   uuid.UUID  `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// NewBaseStruct returns a base struct object
func NewBaseStruct(createdBy uuid.UUID) baseStruct {
	return baseStruct{
		CreatedBy: createdBy,
	}
}
func (b *baseStruct) SetModifiedBy(principal authentication.Principal) error {

	userID := principal.Account().ID

	b.ModifiedBy = &userID
	return nil
}

// GetID returns the ID property for a PlanBasics struct
func (b baseStruct) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for an i base struct
func (b baseStruct) GetModifiedBy() *string {

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
func (b baseStruct) GetCreatedBy() string {
	return b.CreatedBy.String()
}

// CreatedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (b *baseStruct) CreatedByUserAccount(ctx context.Context) *authentication.UserAccount {

	service := appcontext.UserAccountService(ctx)
	account, _ := service(ctx, b.CreatedBy)
	return account

}

// ModifiedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (b *baseStruct) ModifiedByUserAccount(ctx context.Context) *authentication.UserAccount {

	if b.ModifiedBy == nil {
		return nil
	}
	service := appcontext.UserAccountService(ctx)
	// service := authentication.UserAccountService(ctx)
	account, _ := service(ctx, *b.ModifiedBy)
	return account

}
