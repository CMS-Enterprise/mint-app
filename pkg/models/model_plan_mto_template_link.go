package models

import (
	"time"

	"github.com/google/uuid"
)

// ModelPlanMTOTemplateLink represents the relationship between a model plan and an MTO template
// This table tracks which templates have been applied to which model plans and when
type ModelPlanMTOTemplateLink struct {
	baseStruct
	modelPlanRelation
	templateRelation

	AppliedDate time.Time `json:"appliedDate" db:"applied_date"`
	IsActive    bool      `json:"isActive" db:"is_active"`
}

// NewModelPlanMTOTemplateLink returns a new ModelPlanMTOTemplateLink object
func NewModelPlanMTOTemplateLink(
	createdBy uuid.UUID,
	modelPlanID uuid.UUID,
	templateID uuid.UUID,
	appliedDate time.Time,
	isActive bool,
) *ModelPlanMTOTemplateLink {
	return &ModelPlanMTOTemplateLink{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		templateRelation:  NewTemplateRelation(templateID),
		AppliedDate:       appliedDate,
		IsActive:          isActive,
	}
}
