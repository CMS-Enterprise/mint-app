package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// TaskCompletedActivityMeta represents the notification data for a completed plan task.
type TaskCompletedActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	PlanTaskID  uuid.UUID   `json:"planTaskID"`
	TaskKey     PlanTaskKey `json:"taskKey"`
	CompletedBy uuid.UUID   `json:"completedBy"`
}

func newTaskCompletedActivityMeta(
	modelPlanID uuid.UUID,
	planTaskID uuid.UUID,
	taskKey PlanTaskKey,
	completedBy uuid.UUID,
) *TaskCompletedActivityMeta {
	version := 0 // increment if this type ever updates
	return &TaskCompletedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityTaskCompleted, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		PlanTaskID:             planTaskID,
		TaskKey:                taskKey,
		CompletedBy:            completedBy,
	}
}

// NewTaskCompletedActivity creates a new ActivityTaskCompleted type of Activity.
func NewTaskCompletedActivity(
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	planTaskID uuid.UUID,
	taskKey PlanTaskKey,
	completedBy uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     planTaskID,
		ActivityType: ActivityTaskCompleted,
		MetaData: newTaskCompletedActivityMeta(
			modelPlanID,
			planTaskID,
			taskKey,
			completedBy,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database.
func (d TaskCompletedActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO.
func (d *TaskCompletedActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}

// isActivityMetaData allows TaskCompletedActivityMeta to satisfy the ActivityMetaData interface.
func (TaskCompletedActivityMeta) isActivityMetaData() {}
