package models

import (
	"github.com/google/uuid"
)

type BaseModel interface {
	GetModelTypeName() string
	GetID() uuid.UUID
	GetPlanID() uuid.UUID
	GetModifiedBy() *string
}
