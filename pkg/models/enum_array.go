package models

import (
	"database/sql/driver"
	"encoding/json"

	"github.com/lib/pq"
)

type EnumArray[enumType ~string] struct {
	Values []enumType
}

// type EnumArray[enumType ~string] []enumType

// Scan Implements the Scanner interface to decode data from the database
func (e *EnumArray[EnumType]) Scan(value interface{}) error {
	var stringArray pq.StringArray
	if err := stringArray.Scan(value); err != nil {
		return err
	}

	e.Values = make([]EnumType, len(stringArray))
	for i, v := range stringArray {
		e.Values[i] = EnumType(v)
	}
	return nil
}

// Value Implements the Valuer interface to encode data into the database
func (e EnumArray[EnumType]) Value() (driver.Value, error) {
	stringArray := make([]string, len(e.Values))
	for i, v := range e.Values {
		stringArray[i] = string(v)
	}
	return pq.StringArray(stringArray).Value()
}

// MarshalJSON marshals the EnumArray into JSON for GraphQL
func (e EnumArray[EnumType]) MarshalJSON() ([]byte, error) {
	return json.Marshal(e.Values)
}

// UnmarshalJSON unmarshals the EnumArray from JSON for GraphQL
func (e *EnumArray[EnumType]) UnmarshalJSON(data []byte) error {
	var stringArray []string
	if err := json.Unmarshal(data, &stringArray); err != nil {
		return err
	}

	e.Values = make([]EnumType, len(stringArray))
	for i, v := range stringArray {
		e.Values[i] = EnumType(v)
	}
	return nil
}
