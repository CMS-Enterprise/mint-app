package models

import (
	"database/sql/driver"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
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

type TranslationQuestionType string

const (
	TFTOther TranslationQuestionType = "OTHER"
	TFTNote  TranslationQuestionType = "NOTE"
)

// TranslatedAuditField is a structure that shows fields that have been changed by a database action in a human readable format
type TranslatedAuditField struct {
	baseStruct

	TranslatedAuditID uuid.UUID `json:"translatedAuditID" db:"translated_audit_id"`

	ChangeType AuditFieldChangeType `json:"changeType" db:"change_type"`

	FieldName              string                   `json:"fieldName" db:"field_name"`
	FieldNameTranslated    string                   `json:"fieldNameTranslated" db:"field_name_translated"`
	ReferenceLabel         *string                  `json:"referenceLabel" db:"reference_label"`
	QuestionType           *TranslationQuestionType `json:"questionType" db:"question_type"`
	NotApplicableQuestions *pq.StringArray          `json:"notApplicableQuestions" db:"not_applicable_questions"`

	DataType *TranslationDataType `json:"dataType" db:"data_type"`
	FormType *TranslationFormType `json:"formType" db:"form_type"`

	// Changes: (Structure) Can we use a union generic type for these values instead of interface?
	Old           interface{} `json:"old" db:"old"`
	OldTranslated interface{} `json:"oldTranslated" db:"old_translated"`
	New           interface{} `json:"new" db:"new"`
	NewTranslated interface{} `json:"newTranslated" db:"new_translated"`

	MetaDataRaw interface{}                  `db:"meta_data"`
	MetaData    TranslatedAuditFieldMetaData `json:"metaData"`
	// Changes: (Structure) Revisit meta Data. Give it the same treatment as the translated audit table, or perhaps remove it from the fields table if it is completely not needed?
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

	// Changes (Meta) figure out if we need meta data here or not.
	metaDataType := "generic"
	// Changes (Meta) revisit how we determine what to parse here

	meta, err := parseRawTranslatedAuditFieldMetaData(metaDataType, taf.MetaDataRaw)
	if err != nil {
		return err
	}

	taf.MetaData = meta

	// if taf.FormType != nil {
	// 	// Changes (Serialization) Determine where this should be parsed, this doesn't seem quite right...
	// 	// Also, update so we handle for edge cases, status in task list sections, and ready for review
	// 	if *taf.FormType == TFTMultiselect || *taf.FormType == TFTCheckbox {
	// 		// _ = taf.ParseStringArray()
	// 		// Changes (Serialization) this doesn't work, revisit the solution for the representation of this later (perhaps with regex like when translated? Or marshal it directly?)
	// 	}
	// }
	return nil
}

// ParseStringArray converts values that should be viewed as an array to an array
func (taf *TranslatedAuditField) ParseStringArray() error {
	// Changes (Serialization) HANDLE IF ANY OF THESE ARE NULL! DON'T BLOCK PROCESSING THE OTHER ONES AND RETURN EARLY
	if taf.Old != nil {
		oldArray, err := parseInterfaceToArray(taf.Old)
		if err == nil {
			taf.Old = oldArray
		}

	}

	if taf.OldTranslated != nil {
		oldTranslatedArray, err := parseInterfaceToArray(taf.OldTranslated)
		if err == nil {
			taf.OldTranslated = oldTranslatedArray
		}

	}

	if taf.New != nil {
		newArray, err := parseInterfaceToArray(taf.New)
		if err == nil {
			taf.New = newArray
		}

	}

	if taf.NewTranslated != nil {
		newTranslatedArray, err := parseInterfaceToArray(taf.NewTranslated)
		if err == nil {
			taf.NewTranslated = newTranslatedArray
		}
	}

	return nil

}

// parseInterfaceToArray attempts to parse an interface object to a string array. It will return nil if it isn't an array
func parseInterfaceToArray(value interface{}) ([]string, error) {
	stringSlice, ok := value.([]interface{})
	if !ok {

		return nil, fmt.Errorf("error: Could not assert interface to []interface{}")
	}

	// Convert []interface{} to []string
	var stringArray []string
	for _, v := range stringSlice {
		if str, ok := v.(string); ok {
			stringArray = append(stringArray, str)
		} else {

			return nil, fmt.Errorf("error: Element in slice is not a string")
		}
	}
	return stringArray, nil

}
