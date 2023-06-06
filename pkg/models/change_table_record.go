package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// ChangeTableRecord represents an Elasticsearch record from the change table
type ChangeTableRecord struct {
	GUID        string                      `json:"guid"`
	ModelPlanID uuid.UUID                   `json:"model_plan_id"`
	TableID     int                         `json:"table_id"`
	TableName   string                      `json:"table_name"`
	PrimaryKey  uuid.UUID                   `json:"primary_key"`
	ForeignKey  *uuid.UUID                  `json:"foreign_key"`
	Action      string                      `json:"action"`
	Fields      ChangedFields               `json:"fields"`
	ModifiedDts *time.Time                  `json:"modified_dts"`
	ModifiedBy  *authentication.UserAccount `json:"modified_by"`
}

// ChangedFields contains a slice of changed fields.
type ChangedFields struct {
	Changes []*Field `json:"changes"`
}

// Field represents an individual field, including its name and associated value.
type Field struct {
	Name  string     `json:"name"`
	Value FieldValue `json:"value"`
}

// FieldValue represents the new and old values of a changed field.
type FieldValue struct {
	New interface{} `json:"new"`
	Old interface{} `json:"old"`
}
