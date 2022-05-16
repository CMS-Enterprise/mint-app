package resolvers

import (
	"reflect"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/mitchellh/mapstructure"
)

// ApplyChanges applies arbitrary changes from a map to a struct
// Code largely copied from GQLGen's docs on changesets
// https://gqlgen.com/reference/changesets/
func ApplyChanges(changes map[string]interface{}, to interface{}) error {
	// Perform some pre-processing of the changes
	// This is done here rather than in DecodeHook because it's easy to infer intent on things like "" -> nil or [] -> nil here
	for key, value := range changes {
		// Get the reflect value for type comparisons
		reflectValue := reflect.ValueOf(value)

		if reflectValue.Kind() == reflect.String {
			valAsString, _ := reflectValue.Interface().(string)

			// Convert empty strings to `nil``
			if len(valAsString) == 0 {
				changes[key] = nil
				continue
			}
		}

		// Empty slices don't play well with mapstructure, as they enter as []interface{}
		// which promptly gets ignored by mapstructure.
		// In order to get around this, we'll convert empty slices to a real "nil" value
		if reflectValue.Kind() == reflect.Slice && reflectValue.IsNil() {
			changes[key] = nil
		}
	}

	// Set up the decoder. This is almost exactly ripped from https://gqlgen.com/reference/changesets/
	dec, err := mapstructure.NewDecoder(&mapstructure.DecoderConfig{
		ErrorUnused: true,
		TagName:     "json",
		Result:      to,
		ZeroFields:  true,
		// This is needed to get mapstructure to call the gqlgen unmarshaler func for custom scalars (eg Date)
		DecodeHook: func(a reflect.Type, b reflect.Type, v interface{}) (interface{}, error) {
			// If the destination is a time.Time and we need to parse it from a string
			if b == reflect.TypeOf(time.Time{}) && a == reflect.TypeOf("") {
				t, err := time.Parse(time.RFC3339Nano, v.(string))
				return t, err
			}

			// If the desination implements graphql.Unmarshaler
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
