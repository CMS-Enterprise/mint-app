package models

import (
	"github.com/google/uuid"
)

type MTOMilestone struct {
	baseStruct
	modelPlanRelation

	Name *string `json:"name" db:"name"`
}

// NewMTOMilestone returns a new mtoMileMTOMilestone object. A Nil parentID means that this is a top level MileMTOMilestone, and not a subMileMTOMilestone
func NewMTOMilestone(createdBy uuid.UUID, name *string, modelPlanID uuid.UUID) *MTOMilestone {
	return &MTOMilestone{
		Name:              name,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}
