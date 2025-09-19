package models

import (
	"github.com/google/uuid"
)

type MTOTemplateMilestoneSolutionLink struct {
	baseStruct

	TemplateMilestoneID uuid.UUID `json:"templateMilestoneID" db:"mto_template_milestone"`
	TemplateSolutionID  uuid.UUID `json:"templateSolutionID" db:"mto_template_solution"`
	TemplateID          uuid.UUID `json:"templateID" db:"template_id"`
}

// NewMTOTemplateMilestoneSolutionLink returns a new mtoTemplateMilestoneSolutionLink object
func NewMTOTemplateMilestoneSolutionLink(createdBy uuid.UUID, templateMilestoneID uuid.UUID, templateSolutionID uuid.UUID, templateID uuid.UUID) *MTOTemplateMilestoneSolutionLink {
	return &MTOTemplateMilestoneSolutionLink{
		baseStruct:          NewBaseStruct(createdBy),
		TemplateMilestoneID: templateMilestoneID,
		TemplateSolutionID:  templateSolutionID,
		TemplateID:          templateID,
	}
}

// TableName returns the database table name for the MTOTemplateMilestoneSolutionLink model
func (MTOTemplateMilestoneSolutionLink) TableName() string {
	return "mto_template_milestone_solution_link"
}
