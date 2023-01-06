package models

import "github.com/google/uuid"

// PlanDocumentSolutionLink represents a plan document solution link
type PlanDocumentSolutionLink struct {
	baseStruct
	solutionRelation
	DocumentID uuid.UUID `json:"documentID" db:"document_id"`
}
