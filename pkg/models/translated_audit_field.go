package models

import (
	"database/sql/driver"

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
	// This is a type that should not be seen on the frontend. It is possible for it to appear if a value gets changed from null to an empty array, so we expose the type here.
	AFCUnchanged AuditFieldChangeType = "UNCHANGED"
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
	FieldOrder             float64                  `json:"fieldOrder" db:"field_order"`
	ReferenceLabel         *string                  `json:"referenceLabel" db:"reference_label"`
	QuestionType           *TranslationQuestionType `json:"questionType" db:"question_type"`
	NotApplicableQuestions *pq.StringArray          `json:"notApplicableQuestions" db:"not_applicable_questions"`

	DataType TranslationDataType `json:"dataType" db:"data_type"`
	FormType TranslationFormType `json:"formType" db:"form_type"`

	// Note, these interface types generally get interpreted by pq to be a string. This results in returned characters that are meant to escape a string.
	// Currently, the conversion is handled on the frontend. See TranslatedAuditField Loader note https://github.com/CMSgov/mint-app/blob/cfdbc9bc694badf2ff42b0e3772106ecddc91016/pkg/storage/loaders/translated_audit_field_loader.go#L38
	// This is stored correctly in the database, it is just how it is returned from the database, and to graphql in turn.

	Old           interface{} `json:"old" db:"old"`
	OldTranslated interface{} `json:"oldTranslated" db:"old_translated"`
	New           interface{} `json:"new" db:"new"`
	NewTranslated interface{} `json:"newTranslated" db:"new_translated"`
}

// NewTranslatedAuditField creates a new TranslatedAuditField
func NewTranslatedAuditField(
	createdBy uuid.UUID,
	fieldName string,
	fieldNameTranslated string,
	fieldOrder float64,
	old interface{},
	oldTranslated interface{},
	new interface{},
	newTranslated interface{},
	dataType TranslationDataType,
	formType TranslationFormType,
) TranslatedAuditField {

	return TranslatedAuditField{
		baseStruct:          NewBaseStruct(createdBy),
		FieldName:           fieldName,
		FieldNameTranslated: fieldNameTranslated,
		FieldOrder:          fieldOrder,
		Old:                 old,
		OldTranslated:       oldTranslated,
		New:                 new,
		NewTranslated:       newTranslated,

		DataType: dataType,
		FormType: formType,
	}

}
