package models

import (
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// SortDirection represents ASC or DESC for sort directions
type SortDirection string

// these constants represent the values that the SortDirection enum can take
const (
	SortAsc  SortDirection = "ASC"
	SortDesc SortDirection = "DESC"
)

// AuditChange represents a change to a table row in the database
type AuditChange struct {
	ID          int         `json:"id" db:"id"`
	TableName   string      `json:"tableName" db:"table_name"`
	PrimaryKey  uuid.UUID   `json:"primaryKey" db:"primary_key"`
	ForeignKey  uuid.UUID   `json:"foreignKey" db:"foreign_key"`
	Action      string      `json:"action" db:"action"`
	Fields      AuditFields `json:"fields" db:"fields"`
	ModifiedBy  *uuid.UUID  `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time  `json:"modifiedDts" db:"modified_dts"`
}

// AuditFields is a map of changes by field name from the database
type AuditFields map[string]AuditField

// AuditField us a way to represent the old and new values of data from the database.
type AuditField struct {
	Old interface{} `json:"old" db:"old"`
	New interface{} `json:"new" db:"new"`
}

// Value let's the SQL driver transform the data to the AuditFields type
func (a AuditFields) Value() (driver.Value, error) {

	j, err := json.Marshal(a)
	return j, err
}

// ToInterface returns the audit fields as a generic map[string]interface{}
func (a *AuditFields) ToInterface() (map[string]interface{}, error) {
	retVal := map[string]interface{}{}

	bytes, err := json.Marshal(a)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(bytes, &retVal)
	if err != nil {
		return nil, err
	}
	return retVal, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (a *AuditFields) Scan(src interface{}) error {
	if src == nil {
		return nil //TODO fix this
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, a)
	if err != nil {
		return err
	}

	return nil
}

// ModifiedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (ac *AuditChange) ModifiedByUserAccount(ctx context.Context) *authentication.UserAccount { //TODO should this be moved to a shared struct? This isn't a base struct
	if ac.ModifiedBy == nil {
		return nil
	}
	service := authentication.UserAccountService(ctx)
	account, _ := service(ctx, *ac.ModifiedBy)
	return account

}
