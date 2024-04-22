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

	DataType *TranslationDataType `json:"dataType" db:"data_type"`
	FormType *TranslationFormType `json:"formType" db:"form_type"`

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

	// translatedAuditID uuid.UUID, //Audit ID is handled during serialization

	fieldName string,
	fieldNameTranslated string,
	old interface{},
	oldTranslated interface{},
	new interface{},
	newTranslated interface{},
	dataType *TranslationDataType,
	formType *TranslationFormType,
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

		DataType: dataType,
		FormType: formType,

		MetaData: &genericMeta,
	}

}

// ParseMetaData parses raw MetaData into Typed meta data per the provided struct
func (taf *TranslatedAuditField) ParseMetaData() error {

	// Ticket (Meta) figure out if we need meta data here or not.
	metaDataType := "generic"
	// Ticket (Meta) revisit how we determine what to parse here

	meta, err := parseRawTranslatedAuditFieldMetaData(metaDataType, taf.MetaDataRaw)
	if err != nil {
		return err
	}

	taf.MetaData = meta
	return nil
}
