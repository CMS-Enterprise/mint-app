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

// TranslatedAuditField is a structure that shows fields that have been changed by a database action in a human readable format
type TranslatedAuditField struct {
	baseStruct

	TranslatedAuditID uuid.UUID `json:"translatedAuditID" db:"translated_audit_id"`

	FieldName           string `json:"fieldName" db:"field_name"`
	FieldNameTranslated string `json:"fieldNameTranslated" db:"field_name_translated"`

	// Ticket: (ChChCh Changes!) We might consider changing the type from interface to string? But it could be an array. This gives us options
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
func (hmc *TranslatedAuditField) ParseMetaData() error {

	// Ticket (ChChCh Changes!) figure out if we need meta data here or not.

	// meta, err := parseRawTranslatedAuditMetaData(hmc.TableName, hmc.MetaDataRaw)
	// if err != nil {
	// 	return err
	// }

	// hmc.MetaData = meta
	return nil
}
