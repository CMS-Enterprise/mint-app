package models

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// IBaseStruct is an interface that all models must implement
type IBaseStruct interface {
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
	SetModifiedBy(principal authentication.Principal) error
}

// BaseStruct represents the shared data in common betwen all models
type BaseStruct struct {
	ID uuid.UUID `json:"id" db:"id"`
	createdByRelation
	modifiedByRelation
}

// NewBaseStruct returns a base struct object
func NewBaseStruct(createdBy uuid.UUID) BaseStruct {
	return BaseStruct{
		createdByRelation: createdByRelation{
			CreatedBy: createdBy,
		},
	}
}

// SetModifiedBy conditionally sets the modified by property of the struct
func (b *BaseStruct) SetModifiedBy(principal authentication.Principal) error {

	userID := principal.Account().ID

	b.ModifiedBy = &userID
	return nil
}

// GetID returns the ID property for a PlanBasics struct
func (b BaseStruct) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for an IBaseStruct
func (b BaseStruct) GetModifiedBy() *string {

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
func (b BaseStruct) GetCreatedBy() string {
	return b.CreatedBy.String()
}
