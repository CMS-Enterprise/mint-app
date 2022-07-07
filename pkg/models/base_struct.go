package models

import (
	"time"

	"github.com/google/uuid"
)

// IBaseStruct is an interface that all models must implement
type IBaseStruct interface {
	// Get() BaseModel
	GetModelTypeName() string
	GetID() uuid.UUID
	GetPlanID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
}

// BaseStruct represents the shared data in common betwen all models
type BaseStruct struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// Get returns the Base Struct
func (b *BaseStruct) Get() BaseStruct {
	return *b
}
