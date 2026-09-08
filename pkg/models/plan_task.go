package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanTask represents a task associated with a model plan
type PlanTask struct {
	baseStruct
	modelPlanRelation
	completedByRelation

	Key    PlanTaskKey    `json:"key" db:"key"`
	Status PlanTaskStatus `json:"status" db:"status"`
}

// PlanTaskKey is an enum representing the type of task
type PlanTaskKey string

// These constants represent the possible values of a PlanTaskKey
const (
	PlanTaskKeyModelPlan           PlanTaskKey = "MODEL_PLAN"
	PlanTaskKeyMto                 PlanTaskKey = "MTO"
	PlanTaskKeyDataExchange        PlanTaskKey = "DATA_EXCHANGE"
	PlanTaskKeyPrepareForClearance PlanTaskKey = "PREPARE_FOR_CLEARANCE"
)

// PrepareForClearanceTriggerDays is how many days before a model plan's internal clearance start
// date the PREPARE_FOR_CLEARANCE task becomes actionable.
const PrepareForClearanceTriggerDays = 20

// PrepareForClearanceTaskStatus computes the display status of the PREPARE_FOR_CLEARANCE task given
// its stored status and the model plan's internal clearance start date. This trigger is evaluated on
// every read rather than persisted, since it depends purely on elapsed time (now vs. clearanceStarts)
// rather than a discrete user action. Once now is within PrepareForClearanceTriggerDays of
// clearanceStarts, the task is TO_DO; otherwise it stays at storedStatus. A storedStatus other than
// UPCOMING (e.g. COMPLETE, once mark-complete support exists) is left untouched, as is a plan with no
// clearance start date set yet.
func PrepareForClearanceTaskStatus(storedStatus PlanTaskStatus, clearanceStarts *time.Time, now time.Time) PlanTaskStatus {
	if storedStatus != PlanTaskStatusUpcoming || clearanceStarts == nil {
		return storedStatus
	}

	triggerDts := clearanceStarts.AddDate(0, 0, -PrepareForClearanceTriggerDays)
	if now.Before(triggerDts) {
		return storedStatus
	}

	return PlanTaskStatusToDo
}

// PlanTaskStatus is an enum representing the lifecycle status of a task
type PlanTaskStatus string

// These constants represent the possible values of a PlanTaskStatus
const (
	PlanTaskStatusNotNeeded  PlanTaskStatus = "NOT_NEEDED"
	PlanTaskStatusUpcoming   PlanTaskStatus = "UPCOMING"
	PlanTaskStatusToDo       PlanTaskStatus = "TO_DO"
	PlanTaskStatusInProgress PlanTaskStatus = "IN_PROGRESS"
	PlanTaskStatusComplete   PlanTaskStatus = "COMPLETE"
)

// NewPlanTask returns a new PlanTask for a given model plan and key
func NewPlanTask(
	principal uuid.UUID,
	modelPlanID uuid.UUID,
	key PlanTaskKey,
	status PlanTaskStatus,
) *PlanTask {
	return &PlanTask{
		Key:               key,
		Status:            status,
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(principal),
	}
}
