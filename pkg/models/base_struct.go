package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// IBaseStruct is an interface that all models must implement
type IBaseStruct interface {
	// GetBaseStruct() *baseStruct
	GetID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
	SetModifiedBy(principal authentication.Principal) error
}

// baseStruct represents the shared data in common betwen all models
type baseStruct struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// NewBaseStruct returns a base struct object
func NewBaseStruct(createdBy string) baseStruct {
	return baseStruct{
		CreatedBy: createdBy,
	}
}
func (b *baseStruct) SetModifiedBy(principal authentication.Principal) error {
	euaid := principal.ID()

	b.ModifiedBy = &euaid
	return nil
}

// GetBaseStruct returns the Base Struct
func (b *baseStruct) GetBaseStruct() IBaseStruct {
	return b
}

// GetID returns the ID property for a PlanBasics struct
func (b baseStruct) GetID() uuid.UUID {
	return b.ID
}

// GetModifiedBy returns the ModifiedBy property for a PlanBasics struct
func (b baseStruct) GetModifiedBy() *string {
	return b.ModifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (b baseStruct) GetCreatedBy() string {
	return b.CreatedBy
}
