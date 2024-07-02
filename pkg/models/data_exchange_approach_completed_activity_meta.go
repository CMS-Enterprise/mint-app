package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// DataExchangeApproachCompletedActivityMeta represents the notification data that
// is relevant to completing a Data Exchange Approach
type DataExchangeApproachCompletedActivityMeta struct {
	ActivityMetaBaseStruct
	Version              int                  `json:"version"`
	Type                 ActivityType         `json:"type"`
	DataExchangeApproach DataExchangeApproach `json:"dataExchangeApproach"`
	MarkedCompleteBy     uuid.UUID            `json:"markedCompleteBy"`
}

// NewDataExchangeApproachCompletedActivityMeta creates a new DataExchangeApproachCompletedActivityMeta
func NewDataExchangeApproachCompletedActivityMeta(
	version int,
	activityType ActivityType,
	dataExchangeApproach DataExchangeApproach,
	markedCompleteBy uuid.UUID,
) *DataExchangeApproachCompletedActivityMeta {
	return &DataExchangeApproachCompletedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(activityType, version),
		Version:                version,
		Type:                   activityType,
		DataExchangeApproach:   dataExchangeApproach,
		MarkedCompleteBy:       markedCompleteBy,
	}
}

// NewDataExchangeApproachCompletedActivity creates a new Data Exchange Approach Complete type of Activity
func NewDataExchangeApproachCompletedActivity(
	actorID uuid.UUID,
	version int,
	activityType ActivityType,
	dataExchangeApproach DataExchangeApproach,
	markedCompleteBy uuid.UUID,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     markedCompleteBy,
		ActivityType: activityType,
		MetaData: NewDataExchangeApproachCompletedActivityMeta(
			version,
			activityType,
			dataExchangeApproach,
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
