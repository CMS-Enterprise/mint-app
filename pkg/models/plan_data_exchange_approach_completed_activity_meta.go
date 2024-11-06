package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// PlanDataExchangeApproachMarkedCompleteActivityMeta represents the notification data that
// is relevant to completing a Data Exchange Approach
type PlanDataExchangeApproachMarkedCompleteActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	DataExchangeApproachID uuid.UUID `json:"dataExchangeApproachID"`
	MarkedCompleteBy       uuid.UUID `json:"markedCompleteBy"`
}

// newPlanDataExchangeApproachMarkedCompleteActivityMeta creates a new PlanDataExchangeApproachMarkedCompleteActivityMeta
func newPlanDataExchangeApproachMarkedCompleteActivityMeta(
	modelPlanID uuid.UUID,
	dataExchangeApproachID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *PlanDataExchangeApproachMarkedCompleteActivityMeta {
	version := 0 // iterate this if this type ever updates
	return &PlanDataExchangeApproachMarkedCompleteActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityDataExchangeApproachMarkedComplete, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		DataExchangeApproachID: dataExchangeApproachID,
		MarkedCompleteBy:       markedCompleteBy,
	}
}

// NewPlanDataExchangeApproachMarkedCompleteActivity creates a new ActivityDataExchangeApproachMarkedComplete type of Activity
func NewPlanDataExchangeApproachMarkedCompleteActivity(
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	dataExchangeApproachID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     dataExchangeApproachID,
		ActivityType: ActivityDataExchangeApproachMarkedComplete,
		MetaData: newPlanDataExchangeApproachMarkedCompleteActivityMeta(
			modelPlanID,
			dataExchangeApproachID,
			markedCompleteBy,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (d PlanDataExchangeApproachMarkedCompleteActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *PlanDataExchangeApproachMarkedCompleteActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}
