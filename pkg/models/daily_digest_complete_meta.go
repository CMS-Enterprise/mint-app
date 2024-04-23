package models

import (
	"database/sql/driver"
	"time"

	"github.com/google/uuid"
)

// DailyDigestCompleteActivityMeta represents the notification data that is relevant to being tagged in a new Plan Discussion
type DailyDigestCompleteActivityMeta struct {
	ActivityMetaBaseStruct
	ModelPlanIDs []uuid.UUID `json:"modelPlanIDs"`
	Date         time.Time   `json:"date"`
	UserID       uuid.UUID   `json:"userID"`
}

// newDailyDigestCompleteActivityMeta creates a New DailyDigestCompleteActivityMeta
func newDailyDigestCompleteActivityMeta(userID uuid.UUID, date time.Time, modelPlanIDs []uuid.UUID) *DailyDigestCompleteActivityMeta {
	version := 0 //iterate this if this type ever updates
	return &DailyDigestCompleteActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityDigest, version),
		Date:                   date,
		ModelPlanIDs:           modelPlanIDs,
		UserID:                 userID,
	}

}

// NewDailyDigestCompleteActivity creates a New Tagged in Plan Discussion type of Activity
func NewDailyDigestCompleteActivity(actorID uuid.UUID, userID uuid.UUID, date time.Time, modelPlanIDs []uuid.UUID) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     userID,
		ActivityType: ActivityDigest,
		MetaData:     newDailyDigestCompleteActivityMeta(userID, date, modelPlanIDs),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
// We need to do a specific implementation instead of relying on the implementation of the embedded struct, as that will only serialize the common data
func (d DailyDigestCompleteActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *DailyDigestCompleteActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}
