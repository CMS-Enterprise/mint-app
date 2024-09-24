package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// PlanDataExchangeApproachCompletedActivityMeta represents the notification data that
// is relevant to completing a Data Exchange Approach
type PlanDataExchangeApproachCompletedActivityMeta struct {
	ActivityMetaBaseStruct
	DataExchangeApproachID uuid.UUID `json:"dataExchangeApproachID"`
	MarkedCompleteBy       uuid.UUID `json:"markedCompleteBy"`
}

// newPlanDataExchangeApproachCompletedActivityMeta creates a new PlanDataExchangeApproachCompletedActivityMeta
func newPlanDataExchangeApproachCompletedActivityMeta(
	dataExchangeApproachID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *PlanDataExchangeApproachCompletedActivityMeta {
	version := 0 // iterate this if this type ever updates
	return &PlanDataExchangeApproachCompletedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityDataExchangeApproachCompleted, version),
		DataExchangeApproachID: dataExchangeApproachID,
		MarkedCompleteBy:       markedCompleteBy,
	}
}

// NewPlanDataExchangeApproachCompletedActivity creates a new ActivityDataExchangeApproachCompleted type of Activity
func NewPlanDataExchangeApproachCompletedActivity(
	actorID uuid.UUID,
	dataExchangeApproachID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     markedCompleteBy,
		ActivityType: ActivityDataExchangeApproachCompleted,
		MetaData: newPlanDataExchangeApproachCompletedActivityMeta(
			dataExchangeApproachID,
			markedCompleteBy,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (d PlanDataExchangeApproachCompletedActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *PlanDataExchangeApproachCompletedActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}
