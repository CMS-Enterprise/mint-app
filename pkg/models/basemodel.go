package models

import (
	"github.com/google/uuid"
)

type BaseModel interface {
	GetModelTypeName() string
	GetID() uuid.UUID
	GetPlanID() uuid.UUID // TODO: This doesn't make sense if the ModelPlan is the deriving type. We should discuss.
	GetModifiedBy() *string
}
