package models

import "github.com/google/uuid"

// PlanDocumentSolutionLink represents a plan document solution link
type PlanDocumentSolutionLink struct {
	baseStruct
	solutionRelation
	DocumentID uuid.UUID `json:"documentID" db:"document_id"`
}

// NewPlanDocumentSolutionLink creates an instance of a PlanDocumentSolutionLink
func NewPlanDocumentSolutionLink(createdBy uuid.UUID, solutionID uuid.UUID) PlanDocumentSolutionLink {
	return PlanDocumentSolutionLink{
		baseStruct:       NewBaseStruct(createdBy),
		solutionRelation: NewSolutionRelation(solutionID),
	}
}
