package models

import (
	"github.com/google/uuid"
)

type MTOTemplateMilestoneSolutionLink struct {
	baseStruct
	templateRelation

	TemplateMilestoneID uuid.UUID `json:"templateMilestoneID" db:"mto_template_milestone"`
	TemplateSolutionID  uuid.UUID `json:"templateSolutionID" db:"mto_template_solution"`
}

// NewMTOTemplateMilestoneSolutionLink returns a new mtoTemplateMilestoneSolutionLink object
func NewMTOTemplateMilestoneSolutionLink(createdBy uuid.UUID, templateMilestoneID uuid.UUID, templateSolutionID uuid.UUID, templateID uuid.UUID) *MTOTemplateMilestoneSolutionLink {
	return &MTOTemplateMilestoneSolutionLink{
		baseStruct:          NewBaseStruct(createdBy),
		templateRelation:    NewTemplateRelation(templateID),
		TemplateMilestoneID: templateMilestoneID,
		TemplateSolutionID:  templateSolutionID,
	}
}
