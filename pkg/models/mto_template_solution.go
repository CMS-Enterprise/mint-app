package models

import "github.com/google/uuid"

type MTOTemplateSolution struct {
	baseStruct

	Name                string               `json:"name"               db:"name"`
	Key                 MTOCommonSolutionKey `json:"key"                db:"key"`
	TemplateID          uuid.UUID            `json:"templateID"         db:"template_id"`
	MTOCommonSolutionID uuid.UUID            `json:"mtoCommonSolutionID" db:"mto_common_solution_id"`
}

// NewMTOTemplateSolution returns a new MTOTemplateSolution object
func NewMTOTemplateSolution(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	mtoCommonSolutionID uuid.UUID,
) *MTOTemplateSolution {
	return &MTOTemplateSolution{
		baseStruct:          NewBaseStruct(createdBy),
		TemplateID:          templateID,
		MTOCommonSolutionID: mtoCommonSolutionID,
	}
}
