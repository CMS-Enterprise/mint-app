package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// ActivityMetaData is an interface that all activity meta data structs must implement
type ActivityMetaData interface {
	isActivityMetaData()
	Value() (driver.Value, error)
	Scan(src interface{}) error
}

// ActivityMetaBaseStruct represents the shared data in common betwen all models
type ActivityMetaBaseStruct struct {
	Type    ActivityType
	Version int `json:"id"`
}

// NewActivityMetaBaseStruct creates a New ActivityMetaBaseStruct
func NewActivityMetaBaseStruct(activityType ActivityType, version int) ActivityMetaBaseStruct {
	return ActivityMetaBaseStruct{
		Type:    activityType,
		Version: version,
	}
}

// isActivityMetaData implements the IActivityMetaBaseStruct
func (amb ActivityMetaBaseStruct) isActivityMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (amb ActivityMetaBaseStruct) Value() (driver.Value, error) {
	j, err := json.Marshal(amb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (amb *ActivityMetaBaseStruct) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, amb)
	if err != nil {
		return err
	}

	return nil
}

// func GenericScan(src interface{}) error {

// }
