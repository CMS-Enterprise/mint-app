package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// TranslatedAuditMetaGeneric represents the shared data in common between all HumanizedAuditChanges
type TranslatedAuditMetaGeneric struct {
	TranslatedAuditMetaBaseStruct
	Relation        string `json:"relation"`
	RelationContent string `json:"relationContent"`
}

// NewTranslatedAuditMetaGeneric creates a New TranslatedAuditMetaGeneric
func NewTranslatedAuditMetaGeneric(tableName string, version int) TranslatedAuditMetaGeneric {

	return TranslatedAuditMetaGeneric{
		TranslatedAuditMetaBaseStruct: NewTranslatedAuditMetaBaseStruct(tableName, version),
	}
}

// isActivityMetaData implements the IActivityMetaGeneric
func (hmb TranslatedAuditMetaGeneric) isAuditMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb TranslatedAuditMetaGeneric) Value() (driver.Value, error) {
	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *TranslatedAuditMetaGeneric) Scan(src interface{}) error {
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
