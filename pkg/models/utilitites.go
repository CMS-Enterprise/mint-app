package models

import (
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/google/uuid"
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

// StructToTypedMap converts a struct to a Map  string generic type
func StructToTypedMap[MapType any](source interface{}) (map[string]MapType, error) {
	retVal := map[string]MapType{}
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

// StructToTranslationMap converts a struct to a Map  string translation type
func StructToTranslationMap(source interface{}) (map[string]ITranslationField, error) {
	return structToTypedMapByTag[ITranslationField](source, "db")
}

// StructToMapDBTag converts a struct to a map[string]interface{}, using the db tag on the struct.
func StructToMapDBTag(source interface{}) (map[string]interface{}, error) {
	//TODO (ChChCh Changes!) Consider expanding this to translate an underlying struct type, eg a pointer to a struct

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

// structToTypedMapByTag converts a struct to a map[string]Type{}, using the db tag on the struct.
func structToTypedMapByTag[MapType any](source interface{}, tagKey string) (map[string]MapType, error) {

	// Get the type & value of the object
	v := reflect.ValueOf(source)
	t := v.Type()

	// Structs are the only type this function can work with
	if t.Kind() != reflect.Struct {
		return nil, fmt.Errorf("%s is not a struct", t)
	}
	retVal := map[string]MapType{}

	// Iterate over all available fields
	for i := 0; i < t.NumField(); i++ {
		// Get the field
		field := t.Field(i)
		value := v.Field(i)

		// Get the field's tag value
		tagValue := field.Tag.Get(tagKey)
		// If tag was not found skip this field
		if tagValue == "" {
			continue
		}
		interValue := value.Interface()
		typedValue, ok := interValue.(MapType)
		if !ok {
			return nil, fmt.Errorf("unable to cast value as desired type. value %v, type %T", value, retVal)
		}
		retVal[tagValue] = typedValue

	}
	return retVal, nil

}

// StructArrayToMapArray converts an array of structs to an array of Maps
func StructArrayToMapArray[StructType any](structArray []StructType) ([]map[string]interface{}, error) {
	mapSlice := []map[string]interface{}{}
	for _, strct := range structArray {
		sMap, err := StructToMap(strct)
		mapSlice = append(mapSlice, sMap)
		if err != nil {
			return nil, err
		}
	}

	return mapSlice, nil

}

// MapArrayToJSONArray converts an array of maps to a JSON array
func MapArrayToJSONArray(mapSlice []map[string]interface{}) (string, error) {
	byteArr, err := json.Marshal(mapSlice)
	if err != nil {
		return "", err
	}
	return string(byteArr), nil

}

// StructArrayToJSONArray converts an array of structs to a JSON array
//
//	EX: keys := []storage.SolutionAndPossibleKey{{
//		OperationalNeedID: uuid.MustParse("477d4dd4-243d-4e37-82d5-85a583145db0"),
//		IncludeNotNeeded:  true,
//	},
//
//		{
//			OperationalNeedID: uuid.MustParse("84cb4902-3e9a-43dc-ba03-9579bacafd2e"),
//			IncludeNotNeeded:  false,
//		},
//	}
//
// jsonParam, err := models.StructArrayToJSONArray(keys)
//
// This will return the following (using the json tag on the struct field to set the name)
// [
//
//	{
//	    "include_not_needed": true,
//	    "operational_need_id": "477d4dd4-243d-4e37-82d5-85a583145db0"
//	},
//	{
//	    "include_not_needed": false,
//	    "operational_need_id": "84cb4902-3e9a-43dc-ba03-9579bacafd2e"
//	}
//
// ]
// This will allow you to query an array of data as a table in SQL EX
/* SQL
WITH QUERIED_IDS AS (
    SELECT
        include_not_needed,
        operational_need_id,
        CAST(operational_need_id AS TEXT) || CAST(include_not_needed AS TEXT) AS res_key
    FROM
        JSON_TO_RECORDSET(:paramTableJSON)
        AS x("operational_need_id" UUID, "include_not_needed" BOOLEAN ) --noqa
)


*/
// note, that JSON_TO_RECORDSET will parse the JSON from this function, providing the expected type and and field name from the JSON
func StructArrayToJSONArray[StructType any](structArray []StructType) (string, error) {
	mapSlice, err := StructArrayToMapArray[StructType](structArray)
	if err != nil {
		return "", err
	}

	return MapArrayToJSONArray(mapSlice)

}

// UUIDArrayToMapArray converts an array of UUIDs to a map array with the UUID being called whatever you name it
func UUIDArrayToMapArray(uuidArray []uuid.UUID, propertyName string) []map[string]interface{} {
	mapSlice := []map[string]interface{}{}

	for _, uuid := range uuidArray {
		uMap := map[string]interface{}{
			propertyName: uuid.String(),
		}
		mapSlice = append(mapSlice, uMap)
	}
	return mapSlice
}

// UUIDArrayToJSONArray converts an array of UUIDs to JSON
func UUIDArrayToJSONArray(uuidArray []uuid.UUID, propertyName string) (string, error) {
	mapSlice := UUIDArrayToMapArray(uuidArray, propertyName)
	return MapArrayToJSONArray(mapSlice)
}
