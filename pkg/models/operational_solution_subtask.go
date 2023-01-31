package models

import (
	"github.com/google/uuid"
)

// OperationalSolutionSubtask represents the specific implemented solution to an OperationalSolutionSubtask
type OperationalSolutionSubtask struct {
	baseStructUserTable
	solutionRelation

	Name   string                           `json:"name"`
	Status OperationalSolutionSubtaskStatus `json:"status"`
}

// NewOperationalSolutionSubtask is a constructor to create an instance of OperationalSolutionSubtask
func NewOperationalSolutionSubtask(
	createdBy uuid.UUID,
	ID uuid.UUID,
	solutionID uuid.UUID,
	name string,
	status OperationalSolutionSubtaskStatus,
) *OperationalSolutionSubtask {
	return &OperationalSolutionSubtask{
		baseStructUserTable: NewBaseStructUser(createdBy),
		solutionRelation:    NewSolutionRelation(solutionID),
		Name:                name,
		Status:              status,
	}
}
