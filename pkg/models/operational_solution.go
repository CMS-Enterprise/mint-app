package models

import (
	"time"

	"github.com/google/uuid"
)

// OperationalSolution represents the specific implemented solution to an Operational Need
type OperationalSolution struct {
	baseStruct
	OperationalNeedID uuid.UUID        `json:"operationalNeedID" db:"operational_need_id"`
	SolutionType      int              `json:"solutionType" db:"solution_type"`
	SolutionOther     *string          `json:"solutionOther" db:"solution_other"`
	PocName           *string          `json:"pocName" db:"poc_name"`
	PocOther          *string          `json:"pocOther" db:"poc_other"`
	MustStartDts      *time.Time       `json:"mustStartDts" db:"must_start_dts"`
	MustFinishDts     *time.Time       `json:"mustFinishDts" db:"must_finish_dts"`
	Status            OpSolutionStatus `json:"status" db:"status"`
}

// NewOperationalSolution creates a Operation Solution with the required fields
func NewOperationalSolution(createdBy string, operationalNeedID uuid.UUID) *OperationalSolution {

	return &OperationalSolution{
		baseStruct:        NewBaseStruct(createdBy),
		OperationalNeedID: operationalNeedID, //TODO, should this be an embedded struct
	}
}

// OpSolutionStatus represents the types of OpSolutionStatus types.
type OpSolutionStatus string

//These are the options for OpSolutionStatus
const (
	OpSNotStarted OpSolutionStatus = "NOT_STARTED"
	OpSOnboarding OpSolutionStatus = "ONBOARDING"
	OpSBacklog    OpSolutionStatus = "BACKLOG"
	OpSInProgress OpSolutionStatus = "IN_PROGRESS"
	OpSCompleted  OpSolutionStatus = "COMPLETED"
	OpSAtRisk     OpSolutionStatus = "AT_RISK"
)
