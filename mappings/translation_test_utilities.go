package mappings

import (
	"fmt"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

// assertTranslationFields will iterate through all fields in a translation and make sure that they are populated correctly and valid
func assertTranslationFields(t *testing.T, translation Translation) {
	// Get the type & value of the object
	v := reflect.ValueOf(translation)
	typ := v.Type()
	kind := typ.Kind()

	if kind == reflect.Ptr {
		// Dereference the pointer to get the underlying value
		v = v.Elem()
		typ = v.Type()
		kind = typ.Kind()
	}

	// // Structs are the only type this function can work with
	if kind != reflect.Struct {
		t.Errorf("%s is not a struct", typ)
		t.FailNow()
	}

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
		assertTranslationStructField(t, field, value)

	}

}

// assertTranslationStructField asserts that there required translation details are populated based on the type of struct for each field.
func assertTranslationStructField(t *testing.T, field reflect.StructField, value reflect.Value) {
	fieldType := field.Type

	switch fieldType.Name() {
	case "TranslationField":
		assertTranslationField(t, field, value)

	case "TranslationFieldWithOptions":
		assertTranslationFieldWithOptions(t, field, value)

	case "TranslationFieldWithParent":
		assertTranslationFieldWithParent(t, field, value)

	case "TranslationFieldWithOptionsAndChildren":
		assertTranslationFieldWithOptionsAndChildren(t, field, value)

	case "TranslationFieldWithOptionsAndParent":
		assertTranslationFieldWithOptionsAndParent(t, field, value)

	case "TranslationFieldWithParentAndChildren":
		assertTranslationFieldWithParentAndChildren(t, field, value)

	default:
		t.Error("translation type is undefined for", field, value)

	}

}

func assertTranslationField(t *testing.T, field reflect.StructField, value reflect.Value) {
	tField, ok := value.Interface().(models.TranslationField)
	assert.True(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)
	// for

}

func assertTranslationFieldWithOptions(t *testing.T, field reflect.StructField, value reflect.Value) {
	tField, ok := value.Interface().(models.TranslationFieldWithOptions)
	assert.True(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldOptions(t, field, tField)

}
func assertTranslationFieldWithParent(t *testing.T, field reflect.StructField, value reflect.Value) {
	tField, ok := value.Interface().(models.TranslationFieldWithParent)
	assert.True(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldWithParent(t, field, tField)

}

func assertTranslationFieldWithOptionsAndChildren(t *testing.T, field reflect.StructField, value reflect.Value) {
	tField, ok := value.Interface().(models.TranslationFieldWithOptionsAndChildren)
	assert.True(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldOptions(t, field, tField)

	assertTFieldWithChildren(t, field, tField)

}

func assertTranslationFieldWithOptionsAndParent(t *testing.T, field reflect.StructField, value reflect.Value) {
	tField, ok := value.Interface().(models.TranslationFieldWithOptionsAndParent)
	assert.True(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldOptions(t, field, tField)
	assertTFieldWithParent(t, field, tField)

}

func assertTranslationFieldWithParentAndChildren(t *testing.T, field reflect.StructField, value reflect.Value) {
	tField, ok := value.Interface().(models.TranslationFieldWithParentAndChildren)
	assert.True(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldWithParent(t, field, tField)
	assertTFieldWithChildren(t, field, tField)

}

// assertTFieldBase asserts that all fields of a translation are filled out appropriately when they are expected
func assertTFieldBase(t *testing.T, field reflect.StructField, base models.TranslationFieldBase) {

	// assert.NotNil(t, base)
	assert.NotZero(t, base, "issue for field %s", field.Name)

	assert.NotZero(t, base.GqlField, "issue for field %s", field.Name)
	assert.NotZero(t, base.GoField, "issue for field %s", field.Name)
	assert.NotZero(t, base.DbField, "issue for field %s", field.Name)
	assert.NotZero(t, base.Label, "issue for field %s", field.Name)

	// Changes: (Translations), assert
	// assert.NotZero(t, base.ReadOnlyLabel)
	// assert.NotZero(t, base.SubLabel)
	// assert.NotZero(t, base.MultiSelectLabel)
	assertStringPointerNilOrNotEmpty(t, base.ReadOnlyLabel, field)
	assertStringPointerNilOrNotEmpty(t, base.SubLabel, field)
	assertStringPointerNilOrNotEmpty(t, base.MultiSelectLabel, field)

	// assert.NotZero(t, base.IsArray)

	assert.NotZero(t, base.DataType)
	assert.NotZero(t, base.FormType, "issue for field %s. Value: %s", field.Name)

	// Changes: (Translations) how should we assert bools here? False is the NotZero state... so  we might not be able to assert anything about bools that aren't pointers
	// assert.NotZero(t, base.IsNote)
	// assert.NotZero(t, base.IsOtherType)

	assertStringPointerNilOrNotEmpty(t, base.OtherParentField, field)
	// assert.NotZero(t, base.OtherParentField, "issue for field %s", field.Name)
	// assert.NotZero(t, base.ParentReferencesLabel, "issue for field %s", field.Name)
	assertStringPointerNilOrNotEmpty(t, base.ParentReferencesLabel, field)

}

// assertTFieldOptions asserts that a translation has options when it is supposed to
func assertTFieldOptions(t *testing.T, field reflect.StructField, translation models.ITranslationField) {
	options, hasOptions := translation.GetOptions()
	assert.True(t, hasOptions)

	assert.NotZero(t, options, "field %s. Doesn't have options", field.Name)

	count := len(options)
	assert.GreaterOrEqual(t, count, 1, "field %s. Doesn't have options. There are %i options.", field.Name, count)

}

// assertTranslationFieldWithParent asserts that a translation with Parent has parent information populated
func assertTFieldWithParent(t *testing.T, field reflect.StructField, translation models.ITranslationField) {
	parent, hasParent := translation.GetParent()
	assert.True(t, hasParent)

	assert.NotZero(t, parent, "field %s. Doesn't have parent", field.Name)
	// Changes: (Translations) ensure that the parent is correct too? should we run through the test like above? Recursive?

}

// assertTFieldWithChildren asserts that a translation with Children has child information populated
func assertTFieldWithChildren(t *testing.T, field reflect.StructField, translation models.ITranslationField) {

	// Changes: (Translations)  Implement this logic! We should expand the interface to get children as needed as well
	children, hasChildren := translation.GetChildren()
	assert.True(t, hasChildren)

	assert.NotZero(t, children, "field %s. Doesn't have children", field.Name)

	count := len(children)
	assert.GreaterOrEqual(t, count, 1, "field %s. Doesn't have any children defined", field.Name)
	// // Changes: (Translations) ensure that the children are defined correctly too? should we run through the test like above? Recursive?

}

// assertStringPointerNilOrNotEmpty requires a non empty string if a string pointer is not nil
func assertStringPointerNilOrNotEmpty(t *testing.T, value *string, field reflect.StructField) {
	if value == nil {
		return
	}

	assert.NotEqualValues(t, "", *value, "field %s is an empty string, a value was expected", field.Name)

}
