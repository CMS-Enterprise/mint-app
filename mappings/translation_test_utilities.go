package mappings

import (
	"fmt"
	"reflect"
	"testing"

	"github.com/samber/lo"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

// the tag db is what is used to convert a struct to it's relevant DB field
const tagDBName = "db"

// baseStructExcludeFields these are shared excluded fields that don't need to have a translation
var baseStructExcludeFields []string = []string{"ID", "CreatedBy", "CreatedDts", "ModifiedBy", "ModifiedDts"}

// taskListStructExcludeFields are the fields that aren't needed to be translated for most task list sections
var taskListStructExcludeFields []string = append(baseStructExcludeFields, "ModelPlanID")

// assertTranslationFuncAndReturnMap takes a translation function and verify it's not nil, then returns the result of it's ToMap call.
// it returns true if successful, or false if not
func assertTranslationFuncAndReturnMap[T Translation](t *testing.T, translationFunc func() (T, error), structName string) (bool, T, map[string]models.ITranslationField) {

	translation, err := translationFunc()
	assert.NoErrorf(t, err, "Issue deserializing with %s", structName)
	if assert.NotNilf(t, translation, "Translation was nil for %s", structName) {
		tMap, err := translation.ToMap()
		assert.NoErrorf(t, err, "Issue converting translation to map for %s", structName)
		assert.NotNilf(t, tMap, "Issue converting translation to map for %s, it is nil", structName)
		return true, translation, tMap
	}
	return false, translation, nil
}

// assertAllTranslationDataGeneric is a helper function that abstracts all logic to validate a translation functions as expected
// the translationFunc is the function that returns the translation to test
// the source struct is the struct that the translation is for. The name of the test is based on that
// excludedFields is the list of fields that  we expect not to have a matching translation. They are used by assertTranslationStructCoverage
// the function tests that a Translation can be deserialized, converted to a mpe, and that there is a translation for every field
// it will further assert that the specific translations have all data populated as we expect.
func assertAllTranslationDataGeneric[T Translation](t *testing.T, translationFunc func() (T, error), sourceStruct any, excludeFields []string) {

	structName := fmt.Sprintf("%T", sourceStruct)

	// Assert that the type can be deserialized and returned as a map
	success, translation, tMap := assertTranslationFuncAndReturnMap(t, translationFunc, structName)
	if assert.True(t, success) {

		t.Run(structName+"_Translation_Struct_Coverage", func(t *testing.T) {
			assertTranslationStructCoverage(t, tMap, sourceStruct, excludeFields)
		})

		t.Run(structName+"_Verify_Fields_Are_Populated", func(t *testing.T) {
			assertTranslationFields(t, translation)
		})
	}

}

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
	orderSeen := map[float64]string{}
	dbTagSeen := map[string]string{}

	// Iterate over all available fields
	for i := 0; i < typ.NumField(); i++ {
		// Get the field
		field := typ.Field(i)
		value := v.Field(i)
		tField := assertTranslationFieldData(t, field, value)
		if assert.NotNil(t, tField) {
			previousEntry, wasSeen := orderSeen[tField.Order]
			if assert.Falsef(t, wasSeen, "there was a duplicate order entry found for this translation. Previously seen for %s. Current entry %s", previousEntry, tField.GoField) {
				orderSeen[tField.Order] = tField.GoField
			}
			// test that there is only one translation per field so non get overridden. Struct coverage is handled by assertTranslationStructCoverage
			previousDBTag, dbWasSeen := dbTagSeen[tField.DbField]
			if assert.Falsef(t, dbWasSeen, "there was a duplicate db tag for this translation. Previously seen for GQLField %s. Current entry %s", previousDBTag, tField.GqlField) {
				dbTagSeen[tField.DbField] = tField.GqlField
			}

		}

	}

}

func assertTranslationFieldData(t *testing.T, field reflect.StructField, value reflect.Value) *models.TranslationFieldBase {
	kind := value.Kind()
	if assert.EqualValues(t, reflect.Struct, kind, "the translation field expected a struct. found %v", kind) {
		return assertTranslationStructField(t, field, value)

	}
	return nil

}

// assertTranslationStructField asserts that there required translation details are populated based on the type of struct for each field.
func assertTranslationStructField(t *testing.T, field reflect.StructField, translationValue reflect.Value) *models.TranslationFieldBase {
	fieldType := field.Type
	var tFieldBase models.TranslationFieldBase

	switch fieldType.Name() {
	case "TranslationField":
		tFieldBase = assertTranslationField(t, field, translationValue)

	case "TranslationFieldWithOptions":
		tFieldBase = assertTranslationFieldWithOptions(t, field, translationValue)

	case "TranslationFieldWithParent":
		tFieldBase = assertTranslationFieldWithParent(t, field, translationValue)

	case "TranslationFieldWithOptionsAndChildren":
		tFieldBase = assertTranslationFieldWithOptionsAndChildren(t, field, translationValue)

	case "TranslationFieldWithOptionsAndParent":
		tFieldBase = assertTranslationFieldWithOptionsAndParent(t, field, translationValue)

	case "TranslationFieldWithParentAndChildren":
		tFieldBase = assertTranslationFieldWithParentAndChildren(t, field, translationValue)

	default:
		t.Error("translation type is undefined for", field, translationValue)
		return nil

	}
	return &tFieldBase

}

func assertTranslationField(t *testing.T, field reflect.StructField, value reflect.Value) models.TranslationFieldBase {
	tField, ok := value.Interface().(models.TranslationField)
	assert.Truef(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)
	return tField.TranslationFieldBase

}

func assertTranslationFieldWithOptions(t *testing.T, field reflect.StructField, value reflect.Value) models.TranslationFieldBase {
	tField, ok := value.Interface().(models.TranslationFieldWithOptions)
	assert.Truef(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldOptions(t, field, tField)
	return tField.TranslationFieldBase

}
func assertTranslationFieldWithParent(t *testing.T, field reflect.StructField, value reflect.Value) models.TranslationFieldBase {
	tField, ok := value.Interface().(models.TranslationFieldWithParent)
	assert.Truef(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldWithParent(t, field, tField)
	return tField.TranslationFieldBase

}

func assertTranslationFieldWithOptionsAndChildren(t *testing.T, field reflect.StructField, value reflect.Value) models.TranslationFieldBase {
	tField, ok := value.Interface().(models.TranslationFieldWithOptionsAndChildren)
	assert.Truef(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldOptions(t, field, tField)

	assertTFieldWithChildren(t, field, tField)
	return tField.TranslationFieldBase

}

func assertTranslationFieldWithOptionsAndParent(t *testing.T, field reflect.StructField, value reflect.Value) models.TranslationFieldBase {
	tField, ok := value.Interface().(models.TranslationFieldWithOptionsAndParent)
	assert.Truef(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldOptions(t, field, tField)
	assertTFieldWithParent(t, field, tField)

	return tField.TranslationFieldBase

}

func assertTranslationFieldWithParentAndChildren(t *testing.T, field reflect.StructField, value reflect.Value) models.TranslationFieldBase {
	tField, ok := value.Interface().(models.TranslationFieldWithParentAndChildren)
	assert.Truef(t, ok, "the value is not of type %T, it is type %T", tField, value)

	assertTFieldBase(t, field, tField.TranslationFieldBase)

	assertTFieldWithParent(t, field, tField)
	assertTFieldWithChildren(t, field, tField)

	return tField.TranslationFieldBase

}

// assertTFieldBase asserts that all fields of a translation are filled out appropriately when they are expected
func assertTFieldBase(t *testing.T, field reflect.StructField, base models.TranslationFieldBase) {
	assert := assert.New(t)
	assert.NotZerof(base, "issue for field %s", field.Name)

	assert.NotZerof(base.GqlField, "issue for field %s", field.Name)
	assert.NotZerof(base.GoField, "issue for field %s", field.Name)
	assert.NotZerof(base.DbField, "issue for field %s", field.Name)
	assert.NotZerof(base.Label, "issue for field %s", field.Name)

	assertStringPointerNilOrNotEmpty(t, base.ReadOnlyLabel, "ReadOnlyLabel", field)
	assertStringPointerNilOrNotEmpty(t, base.SubLabel, "SubLabel", field)
	assertStringPointerNilOrNotEmpty(t, base.MultiSelectLabel, "MultiSelectLabel", field)

	assert.NotZerof(base.DataType, "issue for field %s. Value: %s", field.Name)
	assert.NotZerof(base.FormType, "issue for field %s. Value: %s", field.Name)

	if base.IsNote {
		someParentDefined := base.OtherParentField != nil || base.ParentReferencesLabel != nil

		assert.True(someParentDefined)
		if base.OtherParentField != nil {
			assert.NotEqualValuesf("", *base.OtherParentField, "OtherParentField %s is an empty string, a value was expected", field.Name)
		} else if base.ParentReferencesLabel != nil {
			assert.NotEqualValuesf("", *base.ParentReferencesLabel, "ParentReferencesLabel %s is an empty string, a value was expected", field.Name)
		} else {
			assert.Failf("Other Parent field and Parent References Label are both undefined.", " Field %v,IsNote %v, IsOther %v", field.Name, base.IsNote, base.IsOtherType)
		}
	}

	assertStringPointerNilOrNotEmpty(t, base.OtherParentField, "OtherParentField", field)
	assertStringPointerNilOrNotEmpty(t, base.ParentReferencesLabel, "ParentReferencesLabel", field)

	// this is filled out and is not 0
	assert.NotZerof(base.Order, "field %s. Doesn't have a non zero order entry", field.Name)

}

// assertTFieldOptions asserts that a translation has options when it is supposed to
func assertTFieldOptions(t *testing.T, field reflect.StructField, translation models.ITranslationField) {

	// This asserts that it has some options it doesn't assert ExportOptions over standard options
	options, hasOptions := translation.GetOptions()
	assert.True(t, hasOptions)

	tableReference, hasTableReference := translation.GetTableReference()
	assert.Falsef(t, hasTableReference, "field %s has options, but also references a table (%s) for a foreign key. The table reference will be missed", field.Name, tableReference)

	assert.NotZerof(t, options, "field %s. Doesn't have options", field.Name)

	count := len(options)
	assert.GreaterOrEqualf(t, count, 1, "field %s. Doesn't have options. There are %i options.", field.Name, count)
	for key, option := range options {
		// translated field is a zero string. If you only translate one option and it is "", it will fail to insert in the database
		assert.NotEqualf(t, option, "", "field %s, option for %s is an empty string, which is not allowed", field.Name, key)

	}

}

// assertTranslationFieldWithParent asserts that a translation with Parent has parent information populated
func assertTFieldWithParent(t *testing.T, field reflect.StructField, translation models.ITranslationField) {
	parent, hasParent := translation.GetParent()
	assert.True(t, hasParent)

	assert.NotZerof(t, parent, "field %s. Doesn't have parent", field.Name)

}

// assertTFieldWithChildren asserts that a translation with Children has child information populated
func assertTFieldWithChildren(t *testing.T, field reflect.StructField, translation models.ITranslationField) {

	children, hasChildren := translation.GetChildren()
	assert.True(t, hasChildren)

	assert.NotZerof(t, children, "field %s. Doesn't have children", field.Name)

	count := len(children)
	assert.GreaterOrEqualf(t, count, 1, "field %s. Doesn't have any children defined", field.Name)

	for childKey, childRelationList := range children {
		assert.NotZero(t, childKey)
		for _, child := range childRelationList {
			// Assert that each exported option at least has a label correctly defined. Update the reflect field so any error messages are still meaningful
			childField := field
			childField.Name = childField.Name + "_child_" + childKey
			assertTFieldBase(t, field, child.TranslationFieldBase)
		}

	}

}

// assertStringPointerNilOrNotEmpty requires a non empty string if a string pointer is not nil
func assertStringPointerNilOrNotEmpty(t *testing.T, value *string, sectionName string, field reflect.StructField) {
	if value == nil {
		return
	}

	assert.NotEqualValuesf(t, "", *value, "field %s, section %s, is an empty string, a value was expected", field.Name, sectionName)

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
	excludedMap := lo.SliceToMap(excludeFields, func(field string) (string, bool) {
		return field, true
	})

	iterateTranslationFieldCoverage(t, translationMap, v, excludedMap)

}

func iterateTranslationFieldCoverage(t *testing.T, translationMap map[string]models.ITranslationField, v reflect.Value, excludeFields map[string]bool) {
	typ := v.Type()

	for i := 0; i < typ.NumField(); i++ {
		field := typ.Field(i)
		value := v.Field(i)

		// Check if this field is excluded
		if _, isExcluded := excludeFields[field.Name]; isExcluded {
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
