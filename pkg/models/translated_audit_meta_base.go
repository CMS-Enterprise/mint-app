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

// TranslatedAuditMetaBaseStruct represents the shared data in common between all HumanizedAuditChanges
type TranslatedAuditMetaBaseStruct struct {
	TableName TableName `json:"tableName"`
	Version   int       `json:"version"`
}

// NewTranslatedAuditMetaBaseStruct creates a New TranslatedAuditMetaBaseStruct
func NewTranslatedAuditMetaBaseStruct(tableName TableName, version int) TranslatedAuditMetaBaseStruct {

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
func parseRawTranslatedAuditMetaData(metaDataType *TranslatedAuditMetaDataType, rawMetaDataJSON interface{}) (TranslatedAuditMetaData, error) {

	if metaDataType == nil {
		return nil, nil
	}

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
	switch *metaDataType {
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
	case TAMetaDiscussionReply:
		{
			meta := TranslatedAuditMetaDiscussionReply{}
			if err := json.Unmarshal(rawData, &meta); err != nil {
				return nil, err
			}
			return &meta, nil
		}
	case TAMetaOperationalNeed:
		{
			meta := TranslatedAuditMetaOperationalNeed{}
			if err := json.Unmarshal(rawData, &meta); err != nil {
				return nil, err
			}
			return &meta, nil
		}
	case TAMetaOperationalSolution:
		{
			meta := TranslatedAuditMetaOperationalSolution{}
			if err := json.Unmarshal(rawData, &meta); err != nil {
				return nil, err
			}
			return &meta, nil
		}
	case TAMetaOperationalSolutionSubtask:
		{
			meta := TranslatedAuditMetaOperationalSolutionSubtask{}
			if err := json.Unmarshal(rawData, &meta); err != nil {
				return nil, err
			}
			return &meta, nil
		}
	case TAMetaDocumentSolutionLink:
		{
			meta := TranslatedAuditMetaDocumentSolutionLink{}
			if err := json.Unmarshal(rawData, &meta); err != nil {
				return nil, err
			}
			return &meta, nil
		}

	default:
		return nil, fmt.Errorf("metaDataType %s is not supported. There is no defined deserialization method", *metaDataType)
	}

}
