package models

type MTOSolution struct {
	baseStruct

	Name          string               `json:"name" db:"name"`
	FacilitatedBy MTOFacilitator       `json:"facilitatedBy" db:"facilitated_by"`
	Status        MTOSolutionStatus    `json:"status" db:"status"`
	RiskIndicator MTORiskIndicator     `json:"riskIndicator" db:"risk_indicator"`
	Key           MTOCommonSolutionKey `json:"key" db:"key"`
	Type          MTOSolutionType      `json:"type" db:"type"`
	PocName       string               `json:"pocName" db:"poc_name"`
	PocEmail      string               `json:"pocEmail" db:"poc_email"`
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
