package models

import (
	"encoding/json"
	"fmt"
	"reflect"
)

// the tag db is what is used to convert a struct to it's relevant DB field
const tagDBName = "db"

// StructToMap converts a struct to a Map  string interface
func StructToMap(source interface{}) (map[string]interface{}, error) {
	retVal := map[string]interface{}{}
	bytes, err := json.Marshal(source)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(bytes, &retVal)
	if err != nil {
		return nil, err
	}
	return retVal, err

}

// StructToMapDBTag converts a struct to a map[string]interface{}, using the db tag on the struct.
func StructToMapDBTag(source interface{}) (map[string]interface{}, error) {
	// Get the type & value of the object
	v := reflect.ValueOf(source)
	t := v.Type()

	// Structs are the only type this function can work with
	if t.Kind() != reflect.Struct {
		return nil, fmt.Errorf("%s is not a struct", t)
	}
	retVal := map[string]interface{}{}

	// Iterate over all available fields
	for i := 0; i < t.NumField(); i++ {
		// Get the field
		field := t.Field(i)
		value := v.Field(i)

		// Get the field's tag value
		tagValue := field.Tag.Get(tagDBName)
		// If tag was not found skip this field
		if tagValue == "" {
			continue
		}
		retVal[tagValue] = value.Interface()

	}
	return retVal, nil

}
