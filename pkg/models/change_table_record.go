package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// ChangeTableRecord represents an Elasticsearch record from the change table
type ChangeTableRecord struct {
	GUID        string                      `json:"guid"`
	TableID     int                         `json:"table_id"`
	TableName   string                      `json:"table_name"`
	PrimaryKey  uuid.UUID                   `json:"primary_key"`
	ForeignKey  *uuid.UUID                  `json:"foreign_key"`
	Action      string                      `json:"action"`
	Fields      ChangedFields               `json:"fields"`
	ModifiedDts *time.Time                  `json:"modified_dts"`
	ModifiedBy  *authentication.UserAccount `json:"modified_by"`
}

// ChangedFieldValue represents an interface for changed field values.
type ChangedFieldValue interface {
	IsChangedFieldValue()
}

// ChangedFields contains a slice of changed fields.
type ChangedFields struct {
	Changes []*Field `json:"changes"`
}

// IsChangedFieldValue is a method to satisfy the ChangedFieldValue interface for ChangedFields.
func (ChangedFields) IsChangedFieldValue() {}

// Field represents an individual field, including its name and associated value.
type Field struct {
	Name  string            `json:"name"`
	Value ChangedFieldValue `json:"value"`
}

// FieldValue represents the new and old values of a changed field.
type FieldValue struct {
	New *string `json:"new"`
	Old *string `json:"old"`
}

// IsChangedFieldValue is a method to satisfy the ChangedFieldValue interface for FieldValue.
func (FieldValue) IsChangedFieldValue() {}
