package resolvers

import (
	"reflect"

	"github.com/99designs/gqlgen/graphql"
	"github.com/mitchellh/mapstructure"
)

// ApplyChanges applies arbitrary changes from a map to a struct
// Code largely copied from GQLGen's docs on changesets
// https://gqlgen.com/reference/changesets/
func ApplyChanges(changes map[string]interface{}, to interface{}) error {
	for key, value := range changes {
		reflectValue := reflect.ValueOf(value)
		if reflectValue.Kind() == reflect.Slice && reflectValue.IsNil() { // empty slices need to be set to `nil`
			changes[key] = nil
		}
	}

	dec, err := mapstructure.NewDecoder(&mapstructure.DecoderConfig{
		ErrorUnused: true,
		TagName:     "json",
		Result:      to,
		ZeroFields:  true,
		// This is needed to get mapstructure to call the gqlgen unmarshaler func for custom scalars (eg Date)
		DecodeHook: func(a reflect.Type, b reflect.Type, v interface{}) (interface{}, error) {
			if reflect.PtrTo(b).Implements(reflect.TypeOf((*graphql.Unmarshaler)(nil)).Elem()) {
				resultType := reflect.New(b)
				result := resultType.MethodByName("UnmarshalGQL").Call([]reflect.Value{reflect.ValueOf(v)})
				err, _ := result[0].Interface().(error)
				return resultType.Elem().Interface(), err
			}

			return v, nil
		},
	})

	if err != nil {
		return err
	}

	return dec.Decode(changes)
}
