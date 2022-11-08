package models

import "github.com/google/uuid"

// PlanDocumentSolutionLink represents a plan document solution link
type PlanDocumentSolutionLink struct {
	baseStruct
	modelPlanRelation

	SolutionID int       `json:"solutionID"`
	DocumentID uuid.UUID `json:"documentID"`
}
