package models

import (
	"time"

	"github.com/google/uuid"
)

// IBaseModel is an interface that all models must implement
type IBaseModel interface {
	// Get() BaseModel
	GetModelTypeName() string
	GetID() uuid.UUID
	GetPlanID() uuid.UUID
	GetCreatedBy() string
	GetModifiedBy() *string
}

// BaseModel represents the shared data in common betwen all models
type BaseModel struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// Get returns the Base Model struct
func (b *BaseModel) Get() BaseModel {
	return *b
}
