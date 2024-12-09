package models

import (
	"time"

	"github.com/google/uuid"
)

// MTOSolutionWithMilestoneID wraps an MTOSolution with a milestone id. It is useful for referring to solutions that are linked to specific milestone
type MTOSolutionWithMilestoneID struct {
	MTOSolution
	MilestoneID uuid.UUID `json:"milestoneID" db:"milestone_id"`
}

type MTOSolution struct {
	baseStruct
	modelPlanRelation

	Name          *string                    `json:"name" db:"name"`
	FacilitatedBy *EnumArray[MTOFacilitator] `json:"facilitatedBy" db:"facilitated_by"`
	NeededBy      *time.Time                 `json:"neededBy" db:"needed_by"`
	Status        MTOSolutionStatus          `json:"status" db:"status"`
	RiskIndicator MTORiskIndicator           `json:"riskIndicator" db:"risk_indicator"`
	Key           *MTOCommonSolutionKey      `json:"key" db:"mto_common_solution_key"`
	Type          *MTOSolutionType           `json:"type" db:"type"`
	PocName       *string                    `json:"pocName" db:"poc_name"`
	PocEmail      *string                    `json:"pocEmail" db:"poc_email"`
}

// MTOSolutionStatus represents the status of an MTO Solution
type MTOSolutionStatus string

// MTOSolutionStatus values
const (
	MTOSolutionStatusNotStarted MTOSolutionStatus = "NOT_STARTED"
	MTOSolutionStatusOnboarding MTOSolutionStatus = "ONBOARDING"
	MTOSolutionStatusBacklog    MTOSolutionStatus = "BACKLOG"
	MTOSolutionStatusInProgress MTOSolutionStatus = "IN_PROGRESS"
	MTOSolutionStatusCompleted  MTOSolutionStatus = "COMPLETED"
)

// AddedFromSolutionLibrary returns true or false if this was added from the common solution library.
// It simply checks if the common solution id is populated or not
func (m *MTOSolution) AddedFromSolutionLibrary() bool {
	return m.Key != nil
}

// NewMTOSolution returns a new MTOSolution object
func NewMTOSolution(
	modelPlanID uuid.UUID,
	commonSolutionKey *MTOCommonSolutionKey,
	name *string,
	solutionType *MTOSolutionType,
	neededBy *time.Time,
	createdBy uuid.UUID,
) *MTOSolution {
	return &MTOSolution{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Key:               commonSolutionKey,
		Name:              name,
		Type:              solutionType,
		NeededBy:          neededBy,
		Status:            MTOSolutionStatusNotStarted,
		RiskIndicator:     MTORiskIndicatorOnTrack,
	}
}
