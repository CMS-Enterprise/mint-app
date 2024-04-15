package mappings

import (
	_ "embed"
	"fmt"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
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

	kind := value.Kind()
	if kind == reflect.Ptr {

		fmt.Print("found a pointer")
	}
	switch kind {
	case reflect.String:
		fmt.Print("found a string")

	case reflect.Struct:
		// fmt.Printf("found struct for field %s \r\n", field.Name)
		// fmt.Printf("%s \r\n", field.Type)
		assertTranslationStructField(t, field.Type, value)

	}

}

func assertTranslationStructField(t *testing.T, fieldType reflect.Type, value reflect.Value) {
	fmt.Printf("%s", fieldType.Name())

	switch fieldType.Name() {
	case "TranslationField":
		fmt.Printf("found %s, /r/n ", fieldType)
		assertTranslationField(t, value)

	case "TranslationFieldWithOptions":
		fmt.Printf("found %s, /r/n ", fieldType)

	case "TranslationFieldWithParent":

		fmt.Printf("found %s, /r/n ", fieldType)

	case "TranslationFieldWithOptionsAndChildren":
		fmt.Printf("found %s, /r/n ", fieldType)

	case "TranslationFieldWithOptionsAndParent":
		fmt.Printf("found %s, /r/n ", fieldType)

	case "TranslationFieldWithParentAndChildren":
		fmt.Printf("found %s, /r/n ", fieldType)

	default:
		fmt.Printf("found %s, /r/n ", fieldType)

	}

}

func assertTranslationField(t *testing.T, value reflect.Value) {
	tField, ok := value.Interface().(models.TranslationField)
	assert.True(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, tField.TranslationFieldBase)
	// for

}

// assertTFieldBase asserts that all fields of a translation are filled out appropriately when they are expected
func assertTFieldBase(t *testing.T, base models.TranslationFieldBase) {

	// assert.NotNil(t, base)
	assert.NotZero(t, base)

	assert.NotZero(t, base.GqlField)
	assert.NotZero(t, base.GoField)
	assert.NotZero(t, base.DbField)
	assert.NotZero(t, base.Label)

	// Changes: (Translations), assert
	assert.NotZero(t, base.ReadOnlyLabel)
	assert.NotZero(t, base.SubLabel)
	assert.NotZero(t, base.MultiSelectLabel)
	assert.NotZero(t, base.IsArray)
	assert.NotZero(t, base.DataType)
	assert.NotZero(t, base.FormType)

	// Changes: (Translations) how should we assert bools here? False is the NotZero state... so  we might not be able to assert anything about bools that aren't pointers
	// assert.NotZero(t, base.IsNote)
	// assert.NotZero(t, base.IsOtherType)

	assert.NotZero(t, base.OtherParentField)
	assert.NotZero(t, base.ParentReferencesLabel)

}
