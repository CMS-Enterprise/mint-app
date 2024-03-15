package models

import (
	"database/sql/driver"
	"time"
)

/* TODO: EASI-(ChChCh Changes!) Work on a job to process data and make type safe audit results
1. See about making a method that will
   a. get all changes from a time period
   b. debounce the changes
   c. create a typed record


*/

// HumanizedAuditChange is a structure that shows grouped, humanReadable Audit data
type HumanizedAuditChange struct {
	// TODO: EASI-(ChChCh Changes!) Think about what should be in the row....
	//Perhaps we want this to be a time frame, and have an array of specific changes instead of just meta data?

	baseStruct
	modelPlanRelation
	ModelName   string              `json:"modelName" db:"model_name"`
	Date        time.Time           `json:"date" db:"date"`
	Changes     AnalyzedAuditChange `json:"changes" db:"changes"`
	MetaDataRaw interface{}         `db:"meta_data"`

	// this is conditional data that is returned. It deserializes to data specific the activity type
	MetaData HumanizedAuditMetaData `json:"metaData"`
}

// HumanizedAuditMetaData is an interface that all Humanized meta data structs must implement
type HumanizedAuditMetaData interface {
	isActivityMetaData()
	Value() (driver.Value, error)
	Scan(src interface{}) error
}
