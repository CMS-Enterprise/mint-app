package mappings

import (
	"fmt"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

// the tag db is what is used to convert a struct to it's relevant DB field
const tagDBName = "db"

// baseStructExcludeFields these are shared excluded fields that don't need to have a translation
var baseStructExcludeFields []string = []string{"ID", "CreatedBy", "CreatedDts", "ModifiedBy", "ModifiedDts"}

// taskListStructExcludeFields are the fields that aren't needed to be translated for most task list sections
var taskListStructExcludeFields []string = append(baseStructExcludeFields, "ModelPlanID")

//Changes (Testing) Assert that every go tag is correct? Is this possible? Example, on plan basics demo_code had extra quotes, and the notes field mapped to demo_code, so the translation was weird

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
		// Changes: (Testing) Update these, we shouldn't have empty flows, we should fail if not a struct
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

	assert.NotZero(t, base, "issue for field %s", field.Name)

	assert.NotZero(t, base.GqlField, "issue for field %s", field.Name)
	assert.NotZero(t, base.GoField, "issue for field %s", field.Name)
	assert.NotZero(t, base.DbField, "issue for field %s", field.Name)
	assert.NotZero(t, base.Label, "issue for field %s", field.Name)

	assertStringPointerNilOrNotEmpty(t, base.ReadOnlyLabel, "ReadOnlyLabel", field)
	assertStringPointerNilOrNotEmpty(t, base.SubLabel, "SubLabel", field)
	assertStringPointerNilOrNotEmpty(t, base.MultiSelectLabel, "MultiSelectLabel", field)

	// assert.NotZero(t, base.IsArray) // not zero doesn't work for bool because false is zero

	assert.NotZero(t, base.DataType)
	assert.NotZero(t, base.FormType, "issue for field %s. Value: %s", field.Name)

	//base.IsOtherType // Other types don't require a parent field or parent reference label. Sometimes the label is sufficient in and of itself
	if base.IsNote {
		someParentDefined := base.OtherParentField != nil || base.ParentReferencesLabel != nil

		assert.True(t, someParentDefined)
		if base.OtherParentField != nil {
			assert.NotEqualValues(t, "", *base.OtherParentField, "OtherParentField %s is an empty string, a value was expected", field.Name)
		} else if base.ParentReferencesLabel != nil {
			assert.NotEqualValues(t, "", *base.ParentReferencesLabel, "ParentReferencesLabel %s is an empty string, a value was expected", field.Name)
		} else {
			// Changes: (Testing)
			assert.Failf(t, "Other Parent field and Parent References Label are both undefined.", " Field %v,IsNote %v, IsOther %v", field.Name, base.IsNote, base.IsOtherType)
		}
	}

	assertStringPointerNilOrNotEmpty(t, base.OtherParentField, "OtherParentField", field)
	assertStringPointerNilOrNotEmpty(t, base.ParentReferencesLabel, "ParentReferencesLabel", field)

}

// assertTFieldOptions asserts that a translation has options when it is supposed to
func assertTFieldOptions(t *testing.T, field reflect.StructField, translation models.ITranslationField) {
	options, hasOptions := translation.GetOptions()
	assert.True(t, hasOptions)

	assert.NotZero(t, options, "field %s. Doesn't have options", field.Name)
	//Changes: (Testing) assert that no option is an empty string. That should not be allowed, as the translated field is a zero string. If you only translate one option and it is nil, it will fail

	count := len(options)
	assert.GreaterOrEqual(t, count, 1, "field %s. Doesn't have options. There are %i options.", field.Name, count)

}

// assertTranslationFieldWithParent asserts that a translation with Parent has parent information populated
func assertTFieldWithParent(t *testing.T, field reflect.StructField, translation models.ITranslationField) {
	parent, hasParent := translation.GetParent()
	assert.True(t, hasParent)

	assert.NotZero(t, parent, "field %s. Doesn't have parent", field.Name)

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
func assertStringPointerNilOrNotEmpty(t *testing.T, value *string, sectionName string, field reflect.StructField) {
	if value == nil {
		return
	}

	assert.NotEqualValues(t, "", *value, "field %s, section %s, is an empty string, a value was expected", field.Name, sectionName)

}

// assertTranslationStructCoverage loops through every field in a struct, it asserts that every field has a translation except for explicitly excluded fields
func assertTranslationStructCoverage(t *testing.T, translationMap map[string]models.ITranslationField, sourceStruct any, excludeFields []string) {

	v := reflect.ValueOf(sourceStruct)
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

	iterateTranslationFieldCoverage(t, translationMap, v, excludeFields)

}

func iterateTranslationFieldCoverage(t *testing.T, translationMap map[string]models.ITranslationField, v reflect.Value, excludeFields []string) {
	typ := v.Type()

	for i := 0; i < typ.NumField(); i++ {
		field := typ.Field(i)
		value := v.Field(i)

		// Check if this field is excluded
		if isExcluded(field.Name, excludeFields) {
			continue
		}

		// Check if the field is an embedded struct
		if field.Anonymous {
			iterateTranslationFieldCoverage(t, translationMap, value, excludeFields)
			continue
		}

		// Get the DB tag
		translationKey := field.Tag.Get(tagDBName)
		if translationKey == "" {
			// If tag was not found, fail
			t.Errorf("field %s does not have a db tag", field.Name)
			t.FailNow()
		}

		// Check if the translation exists in the map
		translationInterface := translationMap[translationKey]
		assert.NotNil(t, translationInterface, "field (%s, tag %s) is expected to have a translation, but it is missing. Please add the translation according to the documentation, or exclude it if needed.", field.Name, translationKey)
	}

}

func isExcluded(fieldName string, excludeFields []string) bool {
	for _, excludedField := range excludeFields {
		if fieldName == excludedField {
			return true
		}
	}
	return false
}
