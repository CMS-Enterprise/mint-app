package models

import "github.com/google/uuid"

// PlanDocumentSolutionLink represents a plan document solution link
type PlanDocumentSolutionLink struct {
	baseStruct
	modelPlanRelation

	SolutionID uuid.UUID `json:"solutionID" db:"solution_id"`
	DocumentID uuid.UUID `json:"documentID" db:"document_id"`
}
