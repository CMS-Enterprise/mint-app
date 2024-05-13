package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
)

// TranslatedAuditMetaData is an interface that all Humanized meta data structs must implement
type TranslatedAuditMetaData interface {
	isAuditMetaData()
	Value() (driver.Value, error)
	Scan(src interface{}) error
}

//Ticket: (ChChCh Changes!) Try to see about what data should be in here? should we have each entry have it's separate data?
// We could have data for Multiple Tables, and for Multiple fields. We need to be able to handle them all....

//Ticket: (ChChCh Changes!) Should we store these as single entries in the database? Or should we store them grouped in the database?

// TranslatedAuditMetaBaseStruct represents the shared data in common between all HumanizedAuditChanges
type TranslatedAuditMetaBaseStruct struct {
	TableName string `json:"tableName"`
	Version   int    `json:"id"`
}

// NewTranslatedAuditMetaBaseStruct creates a New TranslatedAuditMetaBaseStruct
func NewTranslatedAuditMetaBaseStruct(tableName string, version int) TranslatedAuditMetaBaseStruct {

	return TranslatedAuditMetaBaseStruct{
		TableName: tableName,
		Version:   version,
	}
}

// isActivityMetaData implements the IActivityMetaBaseStruct
func (hmb TranslatedAuditMetaBaseStruct) isAuditMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb TranslatedAuditMetaBaseStruct) Value() (driver.Value, error) {
	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *TranslatedAuditMetaBaseStruct) Scan(src interface{}) error {
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
func parseRawTranslatedAuditMetaData(metaDataType TranslatedAuditMetaDataType, rawMetaDataJSON interface{}) (TranslatedAuditMetaData, error) {
	//Changes: (Meta) Figure out how we distinguish meta data type. This should be specific to a field / table, but that isn't here..... \
	// We might need to partially deserialize this to a map, then cast to a type? OR! We could store more data about it in another column.

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
		return nil, fmt.Errorf("unsupported type for TranslatedAuditField Meta Data: %T", rawMetaDataJSON)
	}

	// Add on additional types if they get added.
	switch metaDataType {
	case TAMetaBase:
		{
			// Return a default implementation or handle unsupported types
			meta := TranslatedAuditMetaBaseStruct{}
			if err := json.Unmarshal(rawData, &meta); err != nil {
				return nil, err
			}
			return &meta, nil
		}
	case TAMetaGeneric:
		{
			meta := TranslatedAuditMetaGeneric{}
			if err := json.Unmarshal(rawData, &meta); err != nil {
				return nil, err
			}
			return &meta, nil
		}

	default:
		return nil, fmt.Errorf("metaDataType %s is not supported. There is no defined deserialization method", metaDataType)
	}

}
