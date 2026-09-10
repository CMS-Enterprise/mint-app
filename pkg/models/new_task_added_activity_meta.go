package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// NewTaskAddedActivityMeta represents the notification data for a newly available plan task.
type NewTaskAddedActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	PlanTaskID uuid.UUID   `json:"planTaskID"`
	TaskKey    PlanTaskKey `json:"taskKey"`
}

func newNewTaskAddedActivityMeta(
	modelPlanID uuid.UUID,
	planTaskID uuid.UUID,
	taskKey PlanTaskKey,
) *NewTaskAddedActivityMeta {
	version := 0 // increment if this type ever updates
	return &NewTaskAddedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityNewTaskAdded, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		PlanTaskID:             planTaskID,
		TaskKey:                taskKey,
	}
}

// NewNewTaskAddedActivity creates a new ActivityNewTaskAdded type of Activity.
func NewNewTaskAddedActivity(
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	planTaskID uuid.UUID,
	taskKey PlanTaskKey,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     planTaskID,
		ActivityType: ActivityNewTaskAdded,
		MetaData: newNewTaskAddedActivityMeta(
			modelPlanID,
			planTaskID,
			taskKey,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database.
func (d NewTaskAddedActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO.
func (d *NewTaskAddedActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}

// isActivityMetaData allows NewTaskAddedActivityMeta to satisfy the ActivityMetaData interface.
func (NewTaskAddedActivityMeta) isActivityMetaData() {}
