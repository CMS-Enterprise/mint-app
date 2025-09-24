package models

import "github.com/google/uuid"

type MTOTemplateMilestone struct {
	baseStruct
	templateRelation

	Name                  string                `json:"name"                  db:"name"`
	Key                   MTOCommonMilestoneKey `json:"key" db:"key"`
	MTOTemplateCategoryID *uuid.UUID            `json:"mtoTemplateCategoryID" db:"mto_template_category_id"`
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
