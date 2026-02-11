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

