package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// DataExchangeApproachCompletedActivityMeta represents the notification data that
// is relevant to completing a Data Exchange Approach
type DataExchangeApproachCompletedActivityMeta struct {
	ActivityMetaBaseStruct
	// TODO: (data_exchange) Revisit this, we probably need model plan id on the struct as well.
	DataExchangeApproachID uuid.UUID `json:"dataExchangeApproachID"`
	MarkedCompleteBy       uuid.UUID `json:"markedCompleteBy"`
}

// newDataExchangeApproachCompletedActivityMeta creates a new DataExchangeApproachCompletedActivityMeta
func newDataExchangeApproachCompletedActivityMeta(
	dataExchangeApproachID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *DataExchangeApproachCompletedActivityMeta {
	version := 0 // iterate this if this type ever updates
	return &DataExchangeApproachCompletedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityDataExchangeApproachCompleted, version),
		DataExchangeApproachID: dataExchangeApproachID,
		MarkedCompleteBy:       markedCompleteBy,
	}
}

// NewDataExchangeApproachCompletedActivity creates a new Data Exchange Approach Complete type of Activity
func NewDataExchangeApproachCompletedActivity(
	actorID uuid.UUID,
	dataExchangeApproachID uuid.UUID,
	markedCompleteBy uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     markedCompleteBy,
		ActivityType: ActivityDataExchangeApproachCompleted,
		MetaData: newDataExchangeApproachCompletedActivityMeta(
			dataExchangeApproachID,
			markedCompleteBy,
		),
	}
}

// Value allows us to satisfy the valuer interface so we can write to the database
func (d DataExchangeApproachCompletedActivityMeta) Value() (driver.Value, error) {
	return GenericValue(d)
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (d *DataExchangeApproachCompletedActivityMeta) Scan(src interface{}) error {
	return GenericScan(src, d)
}
