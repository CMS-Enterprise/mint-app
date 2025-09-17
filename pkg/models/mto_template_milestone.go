package models

import "github.com/google/uuid"

type MTOTemplateMilestone struct {
	baseStruct

	Name                  string                `json:"name"                  db:"name"`
	TemplateID            uuid.UUID             `json:"templateID"            db:"template_id"`
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
		TemplateID:            templateID,
		Key:                   mtoCommonMilestoneKey,
		MTOTemplateCategoryID: mtoTemplateCategoryID,
	}
}
