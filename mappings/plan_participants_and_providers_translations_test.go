package mappings

import (
	_ "embed"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParticipantsAndProvidersTranslation(t *testing.T) {
	translation, err := ParticipantsAndProvidersTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

}

func TestParticipantsAndProvidersTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := ParticipantsAndProvidersTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	// Get the type & value of the object
	v := reflect.ValueOf(*translation)
	typ := v.Type()

	// // Structs are the only type this function can work with
	// if typ.Kind() != reflect.Struct {
	// 	return nil, fmt.Errorf("%s is not a struct", t)
	// }
	// retVal := map[string]interface{}{}

	// Iterate over all available fields
	for i := 0; i < typ.NumField(); i++ {
		// Get the field
		field := typ.Field(i)
		value := v.Field(i)
		assertTranslationFieldData(t, field, value)
	}

}

func assertTranslationFieldData(t *testing.T, field reflect.StructField, value reflect.Value) {
	//Changes (Translations) Revisit this, assert non nil values of all fields based on the data type (we are asserting that something that is meant to have options, does have options defined)

}
