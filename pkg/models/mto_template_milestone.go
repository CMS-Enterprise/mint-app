package models

import "github.com/google/uuid"

type MTOTemplateMilestone struct {
	baseStruct
	templateRelation

	// Note name and key are copied from the common milestone table when the template milestone is applied
	Name                  string                `json:"name"                  db:"name"`
	Key                   MTOCommonMilestoneKey `json:"key" db:"key"`
	MTOTemplateCategoryID *uuid.UUID            `json:"mtoTemplateCategoryID" db:"mto_template_category_id"`

	// Filled in by sql query when loading by solution ID
	MTOSolutionID *uuid.UUID `json:"mtoSolutionID" db:"mto_solution_id"`
}

// NewMTOTemplateMilestone returns a new MTOTemplateMilestone object
func NewMTOTemplateMilestone(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	mtoCommonMilestoneKey MTOCommonMilestoneKey,
	mtoTemplateCategoryID *uuid.UUID,
) *MTOTemplateMilestone {
	return &MTOTemplateMilestone{
		baseStruct:            NewBaseStruct(createdBy),
		templateRelation:      NewTemplateRelation(templateID),
		Key:                   mtoCommonMilestoneKey,
		MTOTemplateCategoryID: mtoTemplateCategoryID,
	}
}
