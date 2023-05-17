package models

import "github.com/google/uuid"

// ISolutionRelation is an interface that represents models that are related to a solution.
type ISolutionRelation interface {
	GetSolutionID() uuid.UUID
}

// solutionRelation is a struct meant to be embedded to show that the object should have solution relations enforced
type solutionRelation struct {
	SolutionID uuid.UUID `json:"SolutionID" db:"solution_id"`
}

// NewSolutionRelation returns a solution relation object
func NewSolutionRelation(solutionID uuid.UUID) solutionRelation {
	return solutionRelation{
		SolutionID: solutionID,
	}
}

// GetSolutionID returns the SolutionID of the task list section
func (m solutionRelation) GetSolutionID() uuid.UUID {
	return m.SolutionID
}
