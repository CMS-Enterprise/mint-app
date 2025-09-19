package models

import (
	"time"

	"github.com/google/uuid"
)

// ModelPlanMTOTemplateLink represents the relationship between a model plan and an MTO template
// This table tracks which templates have been applied to which model plans and when
type ModelPlanMTOTemplateLink struct {
	baseStruct

	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	TemplateID  uuid.UUID `json:"templateID" db:"template_id"`
	AppliedDate time.Time `json:"appliedDate" db:"applied_date"`
	IsActive    bool      `json:"isActive" db:"is_active"`
	Notes       *string   `json:"notes" db:"notes"`
}

// NewModelPlanMTOTemplateLink returns a new ModelPlanMTOTemplateLink object
func NewModelPlanMTOTemplateLink(
	createdBy uuid.UUID,
	modelPlanID uuid.UUID,
	templateID uuid.UUID,
	appliedDate time.Time,
	isActive bool,
	notes *string,
) *ModelPlanMTOTemplateLink {
	return &ModelPlanMTOTemplateLink{
		baseStruct:  NewBaseStruct(createdBy),
		ModelPlanID: modelPlanID,
		TemplateID:  templateID,
		AppliedDate: appliedDate,
		IsActive:    isActive,
		Notes:       notes,
	}
}

// TableName returns the database table name for the ModelPlanMTOTemplateLink model
func (ModelPlanMTOTemplateLink) TableName() string {
	return "model_plan_mto_template_link"
}
