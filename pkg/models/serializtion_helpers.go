package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// GenericScan wraps common struct scanning methodology that is common to most structs.
// Scan is used to satisfy the db scanner interface, which populates data in a struct based on a SQL row.
func GenericScan[memberType any](src interface{}, destination *memberType) error {

	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, destination)
	if err != nil {
		return err
	}

	return nil

}

// GenericValue wraps common struct valuing methodology to be shared across most struct types
// Value is used to transform data from a struct into a representation useable by the database for storage
func GenericValue[memberType any](member memberType) (driver.Value, error) {
	j, err := json.Marshal(member)
	return j, err
}
