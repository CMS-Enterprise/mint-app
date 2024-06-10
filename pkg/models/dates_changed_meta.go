package models

import (
	"database/sql/driver"
	"time"

	"github.com/google/uuid"
)

type DateChange struct {
	IsChanged     bool
	Field         string
	IsRange       bool
	OldDate       *time.Time
	NewDate       *time.Time
	OldRangeStart *time.Time
	OldRangeEnd   *time.Time
	NewRangeStart *time.Time
	NewRangeEnd   *time.Time
}

// DatesChangedActivityMeta represents the notification data that is relevant when a user changes dates in a model plan
type DatesChangedActivityMeta struct {
	ActivityMetaBaseStruct
	modelPlanRelation
	DateChanges []DateChange
}

// newDatesChangedActivityMeta creates a new DatesChangedActivityMeta
func newDatesChangedActivityMeta(modelPlanID uuid.UUID, dateChanges []DateChange) *DatesChangedActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &DatesChangedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityDatesChanged, version),
		modelPlanRelation:      NewModelPlanRelation(modelPlanID),
		DateChanges:            dateChanges,
	}

}

// NewDatesChangedActivity creates a new DatesChanged type of Activity
func NewDatesChangedActivity(actorID uuid.UUID, modelPlanID uuid.UUID, dateChanges []DateChange) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     modelPlanID,
		ActivityType: ActivityDatesChanged,
		MetaData:     newDatesChangedActivityMeta(modelPlanID, dateChanges),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (d DatesChangedActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *DatesChangedActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}
