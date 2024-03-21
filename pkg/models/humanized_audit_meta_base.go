package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
)

// HumanizedAuditMetaData is an interface that all Humanized meta data structs must implement
type HumanizedAuditMetaData interface {
	isAuditMetaData()
	Value() (driver.Value, error)
	Scan(src interface{}) error
}

//Ticket: (ChChCh Changes!) Try to see about what data should be in here? should we have each entry have it's separate data?
// We could have data for Multiple Tables, and for Multiple fields. We need to be able to handle them all....

//Ticket: (ChChCh Changes!) Should we store these as single entries in the database? Or should we store them grouped in the database?

// HumanizedAuditMetaBaseStruct represents the shared data in common between all HumanizedAuditChanges
type HumanizedAuditMetaBaseStruct struct {
	TableName string `json:"tableName"`
	Version   int    `json:"id"`
}

// NewHumanizedAuditMetaBaseStruct creates a New HumanizedAuditMetaBaseStruct
func NewHumanizedAuditMetaBaseStruct(tableName string, version int) HumanizedAuditMetaBaseStruct {

	return HumanizedAuditMetaBaseStruct{
		TableName: tableName,
		Version:   version,
	}
}

// isActivityMetaData implements the IActivityMetaBaseStruct
func (hmb HumanizedAuditMetaBaseStruct) isAuditMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb HumanizedAuditMetaBaseStruct) Value() (driver.Value, error) {
	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *HumanizedAuditMetaBaseStruct) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, hmb)
	if err != nil {
		return err
	}

	return nil
}

// parseRawHumanizedAuditMetaData conditionally parses meta data from JSON to a specific meta data type
func parseRawHumanizedAuditMetaData(tableName string, rawMetaDataJSON interface{}) (HumanizedAuditMetaData, error) {
	//Future Enhancement: can this be genericized instead of switching on table name?

	var rawData []byte

	// Check if rawMetaDataJSON is already a string
	if str, ok := rawMetaDataJSON.(string); ok {
		// Convert string to byte array
		rawData = []byte(str)
	} else if bytes, ok := rawMetaDataJSON.([]byte); ok {
		// Use byte array directly
		rawData = bytes
	} else {
		// Invalid type, return an error
		return nil, fmt.Errorf("unsupported type for HumanizedAuditData: %T", rawMetaDataJSON)
	}

	switch tableName {
	case "model_plan":
		// Deserialize the raw JSON into HumanizedAuditMetaBaseStruct
		meta := HumanizedAuditMetaBaseStruct{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil
	case "plan_participants_and_providers":
		// Deserialize the raw JSON into HumanizedAuditMetaBaseStruct
		meta := HumanizedAuditMetaBaseStruct{}
		if err := json.Unmarshal(rawData, &meta); err != nil {

			return nil, err
		}
		return &meta, nil

	// Add cases for other tables if needed

	default:
		// Return a default implementation or handle unsupported types
		meta := HumanizedAuditMetaBaseStruct{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil
		// return nil, fmt.Errorf("unsupported table type: %s", tableName)
	}

}
