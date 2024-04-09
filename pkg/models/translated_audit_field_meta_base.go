package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
)

// TranslatedAuditMetaBaseStruct represents the shared data in common between all HumanizedAuditChanges
type TranslatedAuditFieldMetaBaseStruct struct {
	Version int `json:"id"`
}

// NewTranslatedAuditMetaBaseStruct creates a New TranslatedAuditMetaBaseStruct
func NewTranslatedAuditFieldMetaBaseStruct(version int) TranslatedAuditMetaBaseStruct {

	return TranslatedAuditMetaBaseStruct{
		Version: version,
	}
}

// isActivityMetaData implements the IActivityMetaBaseStruct
func (hmb TranslatedAuditFieldMetaBaseStruct) isAuditMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb TranslatedAuditFieldMetaBaseStruct) Value() (driver.Value, error) {
	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *TranslatedAuditFieldMetaBaseStruct) Scan(src interface{}) error {
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

// parseRawTranslatedAuditMetaData conditionally parses meta data from JSON to a specific meta data type
func parseRawTranslatedAuditFieldMetaData(tableName string, rawMetaDataJSON interface{}) (TranslatedAuditMetaData, error) {
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
		return nil, fmt.Errorf("unsupported type for translated audit field meta data: %T", rawMetaDataJSON)
	}

	switch tableName {
	case "model_plan":
		// Deserialize the raw JSON into HumanizedAuditMetaBaseStruct
		meta := TranslatedAuditFieldMetaBaseStruct{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil
	case "plan_participants_and_providers":
		// Deserialize the raw JSON into HumanizedAuditMetaBaseStruct
		meta := TranslatedAuditFieldMetaBaseStruct{}
		if err := json.Unmarshal(rawData, &meta); err != nil {

			return nil, err
		}
		return &meta, nil

	// Add cases for other tables if needed

	default:
		// Return a default implementation or handle unsupported types
		meta := TranslatedAuditFieldMetaBaseStruct{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil
		// return nil, fmt.Errorf("unsupported table type: %s", tableName)
	}

}
