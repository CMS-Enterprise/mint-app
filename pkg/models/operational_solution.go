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

func NewOperationalSolutionFull(
	id uuid.UUID,
	operationalNeedID uuid.UUID,
	solutionType *int,
	name *string,
	key *OperationalSolutionKey,
	nameOther *string,
	pocName *string,
	pocEmail *string,
	mustStartDts *time.Time,
	mustFinishDts *time.Time,
	isOther *bool,
	isCommonSolution *bool,
	otherHeader *string,
	status OpSolutionStatus,
	createdBy uuid.UUID,
	createdDts time.Time,
	modifiedBy *uuid.UUID,
	modifiedDts *time.Time,
) *OperationalSolution {
	needed := true

	opSol := OperationalSolution{
		baseStruct:              NewBaseStruct(createdBy),
		operationalNeedRelation: NewOperationalNeedRelation(operationalNeedID),
		SolutionType:            solutionType,
		Name:                    name,
		Key:                     key,
		NameOther:               nameOther,
		PocName:                 pocName,
		PocEmail:                pocEmail,
		MustStartDts:            mustStartDts,
		MustFinishDts:           mustFinishDts,
		IsOther:                 isOther,
		IsCommonSolution:        isCommonSolution,
		OtherHeader:             otherHeader,
		Status:                  status,
		Needed:                  &needed,
	}

	opSol.ID = id
	opSol.CreatedDts = createdDts
	opSol.ModifiedBy = modifiedBy
	opSol.ModifiedDts = modifiedDts

	return &opSol
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
