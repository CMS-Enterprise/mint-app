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
	PrimaryKey  uuid.UUID                   `json:"primary_key"`
	ForeignKey  *uuid.UUID                  `json:"foreign_key"`
	Fields      map[string]interface{}      `json:"fields"`
	ModifiedDts *time.Time                  `json:"modified_dts"`
	ModifiedBy  *authentication.UserAccount `json:"modified_by"`
}
