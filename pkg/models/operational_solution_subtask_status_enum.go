package models

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
