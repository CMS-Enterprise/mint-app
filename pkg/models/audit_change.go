package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
)

// AuditChange represents a change to a table row in the database
type AuditChange struct {
	ID          int         `json:"id" db:"id"`
	PrimaryKey  uuid.UUID   `json:"primaryKey" db:"primary_key"`
	ForeignKey  uuid.UUID   `json:"foreignKey" db:"foreign_key"`
	Action      string      `json:"action" db:"action"`
	Fields      AuditFields `json:"fields" db:"fields"`
	ModifiedBy  *string     `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time  `json:"modifiedDts" db:"modified_dts"`
}

// AuditFields is a map of changes by field name from the database
type AuditFields map[string]AuditField

// AuditField us a way to represent the old and new values of data from the database.
type AuditField struct {
	Old interface{} `json:"old" db:"old"`
	New interface{} `json:"new" db:"new"`
}

//Value let's the SQL driver transform the data to the AuditFields type
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

	// var i interface{}
	// err := json.Unmarshal(source, &i)
	// if err != nil {
	// 	return err
	// }
	// // audit := AuditFields{}

	// if err != nil {
	// 	fmt.Println("oh well, nice try")
	// }
	// attempt := map[string](map[sting])

	// *a, ok = i.(map[string]AuditField)
	// // *a, ok = i.(AuditFields)
	// if !ok {
	// 	return errors.New("type assertion .(map[string]AuditField{}) failed")
	// }

	return nil
}

// func (a *AuditField) Scan(src interface{}) error {

// 	if src == nil {
// 		return nil //TODO fix this
// 	}
// 	source, ok := src.([]byte)
// 	if !ok {
// 		return errors.New("type assertion .([]byte) failed")
// 	}
// 	var i interface{}
// 	err := json.Unmarshal(source, &i)
// 	if err != nil {
// 		return err
// 	}
// 	*a, ok = i.(AuditField)
// 	if !ok {
// 		return errors.New("type assertion .(map[string]AuditField{}) failed")
// 	}

// 	return nil
// }
