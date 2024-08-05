package models

import (
	"time"

	"github.com/google/uuid"
)

// OperationalSolution represents the specific implemented solution to an Operational Need
type OperationalSolution struct {
	baseStruct
	operationalNeedRelation
	SolutionType     *int                    `json:"solutionType" db:"solution_type"`
	Needed           *bool                   `json:"needed" db:"needed"` // Null means that it is not an actual record
	Name             *string                 `json:"name" db:"sol_name"`
	Key              *OperationalSolutionKey `json:"key" db:"sol_key"`
	NameOther        *string                 `json:"nameOther" db:"name_other"`
	PocName          *string                 `json:"pocName" db:"poc_name"`
	PocEmail         *string                 `json:"pocEmail" db:"poc_email"`
	MustStartDts     *time.Time              `json:"mustStartDts" db:"must_start_dts"`
	MustFinishDts    *time.Time              `json:"mustFinishDts" db:"must_finish_dts"`
	IsOther          *bool                   `json:"isOther" db:"is_other"`
	IsCommonSolution *bool                   `json:"isCommonSolution" db:"is_common_solution"` // This is returned by the query true or false if it linked as a possible solution by need type. It is not stored in the operational_solution table, but we still map it here with a "db:" struct tag
	OtherHeader      *string                 `json:"otherHeader" db:"other_header"`
	Status           OpSolutionStatus        `json:"status" db:"status"`
}

type OperationalSolutionWithNumberOfSubtasks struct {
	OperationalSolution
	NumberOfSubtasks int `json:"numberOfSubtasks" db:"number_of_subtasks"`
}

// NewOperationalSolution creates a Operation Solution with the required fields
func NewOperationalSolution(createdBy uuid.UUID, operationalNeedID uuid.UUID) *OperationalSolution {
	needed := true

	return &OperationalSolution{
		baseStruct:              NewBaseStruct(createdBy),
		operationalNeedRelation: NewOperationalNeedRelation(operationalNeedID),
		Status:                  OpSNotStarted,
		Needed:                  &needed,
	}
}

// OpSolutionStatus represents the types of OpSolutionStatus types.
type OpSolutionStatus string

// These are the options for OpSolutionStatus
const (
	OpSNotStarted OpSolutionStatus = "NOT_STARTED"
	OpSOnboarding OpSolutionStatus = "ONBOARDING"
	OpSBacklog    OpSolutionStatus = "BACKLOG"
	OpSInProgress OpSolutionStatus = "IN_PROGRESS"
	OpSCompleted  OpSolutionStatus = "COMPLETED"
	OpSAtRisk     OpSolutionStatus = "AT_RISK"
)

// opSolutionStatusHumanized maps OperationalSolutionStatuses to a human-readable string
var opSolutionStatusHumanized = map[OpSolutionStatus]string{
	OpSNotStarted: "Not Started",
	OpSOnboarding: "Onboarding",
	OpSBacklog:    "Backlog",
	OpSInProgress: "In Progress",
	OpSCompleted:  "Completed",
	OpSAtRisk:     "At RisK",
}

// Humanize returns the human-readable string of a Operational Solution  Status
// if a value is not found for the provided status, an empty string is returned
func (oss OpSolutionStatus) Humanize() string {
	return opSolutionStatusHumanized[oss]
}

// GetName returns either the type name from the Possible Operational Solution Table if it is a defined type, or the other name if an other type.
// if both are nil, it returns an empty string
func (opSol OperationalSolution) GetName() string {
	if opSol.SolutionType != nil {
		if opSol.Name != nil {
			return *opSol.Name
		}
	}
	if opSol.NameOther != nil {
		return *opSol.NameOther
	}
	return ""

}

// GetIsOther checks if this is a custom need, or a predefined possible operational need
func (opSol OperationalSolution) GetIsOther() bool {
	return opSol.SolutionType == nil
}
