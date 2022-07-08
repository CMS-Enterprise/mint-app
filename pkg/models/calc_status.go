package models

import (
	"fmt"
	"reflect"
	"strconv"
)

// The `statusWeight` tag is used to indicate how much "weight" a field of a struct should hold when
// being calculated for the overall status of the struct.
const tagName = "statusWeight"

// GenericallyCalculateStatus (Deprecated:) calculates the overall status of a struct based on the `statusWeight` tags.
// The function has the following restrictions, and will throw an error if any of the conditions are not met:
// - The only parameter to this function must be a struct. If it is not, an error will be returned.
// - If the struct has `statusWeight` tags, they MUST be placed on pointer types only
// - If the `statusWeight` tag is not a valid integer
func GenericallyCalculateStatus(obj interface{}) (TaskStatus, error) {
	currentWeight := 0
	totalWeight := 0
	filledOut := false
	// Get the type & value of the object
	v := reflect.ValueOf(obj)
	t := v.Type()

	// Structs are the only type this function can work with
	if t.Kind() != reflect.Struct {
		return TaskStatus(""), fmt.Errorf("%s is not a struct", t)
	}

	// Iterate over all available fields
	for i := 0; i < t.NumField(); i++ {
		// Get the field
		field := t.Field(i)
		value := v.Field(i)

		// Get the field's tag value
		tagValue := field.Tag.Get(tagName)

		// If tag was not found skip this field
		if tagValue == "" {
			continue
		}

		// Check for valid field type, and if the data is filled
		switch field.Type.Kind() {
		case reflect.Ptr:
			filledOut = !value.IsNil()
		case reflect.Slice:
			filledOut = value.Len() > 0
		default:
			return TaskStatus(""), fmt.Errorf("field %v is not a supported type for status calculation (found %v)", field.Name, field.Type)
		}

		// Convert the tag value to an int
		weight, err := strconv.ParseInt(tagValue, 10, 32)
		if err != nil {
			return TaskStatus(""), err
		}

		// Always add weight to the total
		totalWeight += int(weight)

		// If the value is filled out also add the weight to the current weight
		if filledOut {
			currentWeight += int(weight)
		}

	}

	if totalWeight == 0 {
		return TaskStatus(""), fmt.Errorf("no fields have the %v tag", tagName)
	}

	status := TaskReady

	if currentWeight == totalWeight {
		status = TaskComplete
	} else if currentWeight > 0 {
		status = TaskInProgress
	}
	return status, nil
}
