package models

import (
	"github.com/google/uuid"
)

// OperationalSolutionSubtaskStatus is an enum that represents the possible operational solution subtask statuses
type OperationalSolutionSubtaskStatus string

// These constants represent the different values of OperationalSolutionSubtaskStatus
const (
	OperationalSolutionSubtaskStatusTodo       OperationalSolutionSubtaskStatus = "TODO"
	OperationalSolutionSubtaskStatusInProgress OperationalSolutionSubtaskStatus = "IN_PROGRESS"
	OperationalSolutionSubtaskStatusDone       OperationalSolutionSubtaskStatus = "DONE"
)

// AllOperationalSolutionSubtaskStatus is a collection of all possible values for OperationalSolutionSubtaskStatus
var AllOperationalSolutionSubtaskStatus = []OperationalSolutionSubtaskStatus{
	OperationalSolutionSubtaskStatusTodo,
	OperationalSolutionSubtaskStatusInProgress,
	OperationalSolutionSubtaskStatusDone,
}

// OperationalSolutionSubtask represents the specific implemented solution to an OperationalSolutionSubtask
type OperationalSolutionSubtask struct {
	baseStruct
	solutionRelation

	Name   string                           `json:"name" db:"name"`
	Status OperationalSolutionSubtaskStatus `json:"status" db:"status"`
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
		baseStruct:       NewBaseStruct(createdBy),
		solutionRelation: NewSolutionRelation(solutionID),
		Name:             name,
		Status:           status,
	}
}
