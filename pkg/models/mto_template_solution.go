package models

import "github.com/google/uuid"

type MTOTemplateSolution struct {
	baseStruct
	templateRelation

	Name                string               `json:"name"               db:"name"`
	Key                 MTOCommonSolutionKey `json:"key"                db:"key"`
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
		templateRelation:    NewTemplateRelation(templateID),
		MTOCommonSolutionID: mtoCommonSolutionID,
	}
}
