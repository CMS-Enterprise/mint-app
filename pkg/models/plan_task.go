package models

import "github.com/google/uuid"

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
	PlanTaskKeyModelPlan              PlanTaskKey = "MODEL_PLAN"
	PlanTaskKeyMto                    PlanTaskKey = "MTO"
	PlanTaskKeyDataExchange           PlanTaskKey = "DATA_EXCHANGE"
	PlanTaskKeyWaiverAssessmentSurvey PlanTaskKey = "WAIVER_ASSESSMENT_SURVEY"
	PlanTaskKeyTwoPager               PlanTaskKey = "TWO_PAGER"
)

// manuallyMarkablePlanTaskKeys are the PlanTaskKeys whose status is set directly by a user via
// PlanTaskMarkComplete (pkg/graph/resolvers/plan_task.go) and the markPlanTaskComplete mutation,
// rather than calculated from other model state. MODEL_PLAN, MTO, and DATA_EXCHANGE are
// recalculated automatically (see pkg/graph/resolvers/plan_task_status_updates.go) and must not be
// included here, or a manual mark could be silently overwritten the next time their calculated
// status runs.
//
// Adding a new task key generally means touching three places: this map (only if it's manually
// markable), the seeding list in ModelPlanCreate (pkg/graph/resolvers/model_plan.go), and either a
// new calculated-status function in plan_task_status_updates.go or reuse of PlanTaskMarkComplete.
var manuallyMarkablePlanTaskKeys = map[PlanTaskKey]bool{
	PlanTaskKeyTwoPager: true,
}

// IsManuallyMarkable reports whether a PlanTaskKey's status is set directly by a user
// (e.g. via a "mark complete" action) rather than calculated from other model state.
func (k PlanTaskKey) IsManuallyMarkable() bool {
	return manuallyMarkablePlanTaskKeys[k]
}

// planTaskKeyDisplayNames are short human-readable names for a PlanTaskKey, used in notifications
// and change history. Keys without an entry fall back to their raw string value.
var planTaskKeyDisplayNames = map[PlanTaskKey]string{
	PlanTaskKeyModelPlan:    "Model Plan",
	PlanTaskKeyDataExchange: "Data exchange approach",
	PlanTaskKeyMto:          "Model-to-operations matrix (MTO)",
	PlanTaskKeyTwoPager:     "2-pager review",
}

// DisplayName returns a short human-readable name for this task key.
func (k PlanTaskKey) DisplayName() string {
	if name, ok := planTaskKeyDisplayNames[k]; ok {
		return name
	}
	return string(k)
}

// planTaskKeyChangeHistoryNames are the task names shown in change history. These match the Tasks
// list UI's card heading (src/i18n/en-US/modelPlan/tasks.ts) rather than the shorter DisplayName()
// used in notifications. Only keys whose heading is constant across statuses are listed here; keys
// without an entry fall back to DisplayName().
var planTaskKeyChangeHistoryNames = map[PlanTaskKey]string{
	PlanTaskKeyTwoPager: "Prepare for your 2-page review meeting with CMMI Front Office",
}

// ChangeHistoryDisplayName returns the task name shown in change history.
func (k PlanTaskKey) ChangeHistoryDisplayName() string {
	if name, ok := planTaskKeyChangeHistoryNames[k]; ok {
		return name
	}
	return k.DisplayName()
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
