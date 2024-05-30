package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// TranslatedAuditMetaOperationalNeed represents the data about an operational need to render an operational need human readable.
type TranslatedAuditMetaOperationalNeed struct {
	TranslatedAuditMetaBaseStruct
	NeedName string `json:"needName"`
	IsOther  bool   `json:"isOther"`
}

// NewTranslatedAuditMetaOperationalNeed creates a New TranslatedAuditMetaOperationalNeed
func NewTranslatedAuditMetaOperationalNeed(tableName string, version int, needName string, isOther bool) TranslatedAuditMetaOperationalNeed {

	return TranslatedAuditMetaOperationalNeed{
		TranslatedAuditMetaBaseStruct: NewTranslatedAuditMetaBaseStruct(tableName, version),
		NeedName:                      needName,
		IsOther:                       isOther,
	}
}

// isActivityMetaData implements the IActivityMetaGeneric
func (hmb TranslatedAuditMetaOperationalNeed) isAuditMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb TranslatedAuditMetaOperationalNeed) Value() (driver.Value, error) {
	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *TranslatedAuditMetaOperationalNeed) Scan(src interface{}) error {
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
