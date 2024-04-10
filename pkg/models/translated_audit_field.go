package models

import (
	"database/sql/driver"

	"github.com/google/uuid"
)

// TranslatedAuditFieldMetaData is an interface that all Humanized meta data structs must implement
type TranslatedAuditFieldMetaData interface {
	isAuditMetaData()
	Value() (driver.Value, error)
	Scan(src interface{}) error
}

// AuditFieldChangeType is an enum that represents the possible types of changes that could happen to an audited field
type AuditFieldChangeType string

// These constants represent the different values of AuditFieldChangeType
const (
	AFCAnswered AuditFieldChangeType = "ANSWERED"
	AFCUpdated  AuditFieldChangeType = "UPDATED"
	AFCRemoved  AuditFieldChangeType = "REMOVED"
)

// TranslatedAuditField is a structure that shows fields that have been changed by a database action in a human readable format
type TranslatedAuditField struct {
	baseStruct

	TranslatedAuditID uuid.UUID `json:"translatedAuditID" db:"translated_audit_id"`

	ChangeType AuditFieldChangeType `json:"changeType" db:"change_type"`

	FieldName           string `json:"fieldName" db:"field_name"`
	FieldNameTranslated string `json:"fieldNameTranslated" db:"field_name_translated"`

	Old           interface{} `json:"old" db:"old"`
	OldTranslated interface{} `json:"oldTranslated" db:"old_translated"`
	New           interface{} `json:"new" db:"new"`
	NewTranslated interface{} `json:"newTranslated" db:"new_translated"`

	MetaDataRaw interface{}                  `db:"meta_data"`
	MetaData    TranslatedAuditFieldMetaData `json:"metaData"`
}

// NewTranslatedAuditField
func NewTranslatedAuditField(
	createdBy uuid.UUID,
	// Ticket: (EASI-4147) Update this to make sure we save the audit ID as needed
	// translatedAuditID uuid.UUID,

	fieldName string,
	fieldNameTranslated string,
	old interface{},
	oldTranslated interface{},
	new interface{},
	newTranslated interface{},
) TranslatedAuditField {
	version := 0
	genericMeta := NewTranslatedAuditFieldMetaBaseStruct(version)

	return TranslatedAuditField{
		baseStruct: NewBaseStruct(createdBy),

		// TranslatedAuditID: translatedAuditID,

		FieldName:           fieldName,
		FieldNameTranslated: fieldNameTranslated,
		Old:                 old,
		OldTranslated:       oldTranslated,
		New:                 new,
		NewTranslated:       newTranslated,

		MetaData: &genericMeta,
	}

}

// ParseMetaData parses raw MetaData into Typed meta data per the provided struct
func (taf *TranslatedAuditField) ParseMetaData() error {

	// Ticket (ChChCh Changes!) figure out if we need meta data here or not.
	metaDataType := "generic"
	// Ticket (EASI-4147) revisit how we determine what to parse here

	meta, err := parseRawTranslatedAuditFieldMetaData(metaDataType, taf.MetaDataRaw)
	if err != nil {
		return err
	}

	taf.MetaData = meta
	return nil
}
