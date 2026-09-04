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
	PlanTaskKeyModelPlan    PlanTaskKey = "MODEL_PLAN"
	PlanTaskKeyMto          PlanTaskKey = "MTO"
	PlanTaskKeyDataExchange PlanTaskKey = "DATA_EXCHANGE"
	PlanTaskKeyTwoPager     PlanTaskKey = "TWO_PAGER"
	PlanTaskKeySixPager     PlanTaskKey = "SIX_PAGER"
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
	PlanTaskKeySixPager: true,
}

// IsManuallyMarkable reports whether a PlanTaskKey's status is set directly by a user
// (e.g. via a "mark complete" action) rather than calculated from other model state.
func (k PlanTaskKey) IsManuallyMarkable() bool {
	return manuallyMarkablePlanTaskKeys[k]
}

// planTaskActivationTriggers maps a manually-markable PlanTaskKey to the PlanTaskKey it activates
// (moves from UPCOMING to TO_DO) the moment the triggering key is marked complete. Activation is a
// one-way transition: the target task is never moved back to UPCOMING, even if the triggering task
// is later marked incomplete again (see PlanTaskMarkComplete in pkg/graph/resolvers/plan_task.go).
var planTaskActivationTriggers = map[PlanTaskKey]PlanTaskKey{
	PlanTaskKeyTwoPager: PlanTaskKeySixPager,
}

// ActivationTarget returns the PlanTaskKey that should activate (move from UPCOMING to TO_DO) when k
// is marked complete, if one is configured.
func (k PlanTaskKey) ActivationTarget() (PlanTaskKey, bool) {
	target, ok := planTaskActivationTriggers[k]
	return target, ok
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
