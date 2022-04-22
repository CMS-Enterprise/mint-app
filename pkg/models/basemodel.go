package models

import (
	"github.com/google/uuid"
)

// BaseModel is an interface that all models must implement
type BaseModel interface {
	GetModelTypeName() string
	GetID() uuid.UUID
	GetPlanID() uuid.UUID
	GetModifiedBy() *string
}
