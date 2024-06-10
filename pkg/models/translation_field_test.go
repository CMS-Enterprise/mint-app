package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTranslationFieldInterface(t *testing.T) {

	testIfImplementsITranslationField(t, TranslationField{})
	testIfImplementsITranslationField(t, TranslationFieldWithOptions{})

	testIfImplementsITranslationField(t, TranslationFieldWithParent{})
	testIfImplementsITranslationField(t, &TranslationFieldWithOptionsAndChildren{})

	testIfImplementsITranslationField(t, &TranslationFieldWithOptionsAndParent{})
	testIfImplementsITranslationField(t, &TranslationFieldWithParentAndChildren{})

}

func testIfImplementsITranslationField(t *testing.T, interfaceValue interface{}) {
	_, ok := interfaceValue.(ITranslationField)
	assert.True(t, ok, "%T does not implement ITranslationField", interfaceValue)
}

func TestTranslationFieldLabel(t *testing.T) {
	testBaseLabel := "Hooray Base Label"
	testReadOnlyLabel := "Hooray ReadOnly Label"
	testSubLabel := "Hooray Sub Label"

	otherParentField := "parent_field_db_struct_label"
	parentLabel := "Hooray, you got the label from the parent"

	testTranslation := TranslationField{
		TranslationFieldBase: TranslationFieldBase{

			Label:                 testBaseLabel,
			ReadOnlyLabel:         &testReadOnlyLabel,
			SubLabel:              &testSubLabel,
			MultiSelectLabel:      nil,
			IsArray:               false,
			DataType:              TDTString,
			FormType:              TFTText,
			IsNote:                false,
			IsOtherType:           false,
			OtherParentField:      &otherParentField,
			ParentReferencesLabel: nil,
			ExportLabel:           nil,
		},
	}

	parentTranslationTest := TranslationField{
		TranslationFieldBase: TranslationFieldBase{
			DbField: otherParentField,

			Label:                 parentLabel,
			ReadOnlyLabel:         nil,
			SubLabel:              nil,
			MultiSelectLabel:      nil,
			IsArray:               false,
			DataType:              TDTString,
			FormType:              TFTText,
			IsNote:                false,
			IsOtherType:           false,
			OtherParentField:      nil,
			ParentReferencesLabel: nil,
		},
	}

	testTranslationMap := map[string]ITranslationField{
		otherParentField: parentTranslationTest,
	}

	//Changes: (Translations) Should GetLabel return an error ever?

	t.Run("label field is the fall through field", func(t *testing.T) {
		// When there is no note or is other, and no export label, use the base label
		label := testTranslation.GetLabel()
		assert.EqualValues(t, testBaseLabel, label)
	})
	t.Run("Other parent field is used for reference label if present", func(t *testing.T) {
		// if isNote or if isOther use the
		testTranslation.IsNote = true
		label := testTranslation.GetLabel()
		assert.EqualValues(t, testBaseLabel, label)
		referencesLabel := testTranslation.GetReferencesLabel(testTranslationMap)
		assert.EqualValues(t, &parentLabel, referencesLabel)
		testTranslation.IsOtherType = true
		testTranslation.IsNote = false
		label = testTranslation.GetLabel()
		assert.EqualValues(t, testBaseLabel, label)
	})

	t.Run("Other parent field is used for references if present. If a parent field isn't found, nil references", func(t *testing.T) {
		// if isNote or if isOther use the
		testTranslation.IsNote = true
		parentField := "false_field_name"
		testTranslation.OtherParentField = &parentField
		label := testTranslation.GetLabel()
		assert.EqualValues(t, testBaseLabel, label)
		referencesLabel := testTranslation.GetReferencesLabel(testTranslationMap)
		assert.Nil(t, referencesLabel)

		testTranslation.IsOtherType = true
		testTranslation.IsNote = false
		label = testTranslation.GetLabel()
		assert.EqualValues(t, testBaseLabel, label)
		referencesLabel = testTranslation.GetReferencesLabel(testTranslationMap)
		assert.Nil(t, referencesLabel)
	})
	t.Run("ParentReferencesLabel  is prioritized over Other Parent Field if present", func(t *testing.T) {
		testTranslation.IsNote = true
		parentReferenceLabel := "References Label"
		testTranslation.ParentReferencesLabel = &parentReferenceLabel

		label := testTranslation.GetLabel()
		assert.EqualValues(t, testBaseLabel, label)
		referencesLabel := testTranslation.GetReferencesLabel(testTranslationMap)
		assert.EqualValues(t, &parentReferenceLabel, referencesLabel)

		testTranslation.IsOtherType = true
		testTranslation.IsNote = false
		label = testTranslation.GetLabel()
		assert.EqualValues(t, testBaseLabel, label)
		referencesLabel = testTranslation.GetReferencesLabel(testTranslationMap)
		assert.EqualValues(t, &parentReferenceLabel, referencesLabel)
	})
	t.Run("If parentReferencesLabel and Other Parent Field are null, references label will be null", func(t *testing.T) {
		testTranslation.IsNote = true
		testTranslation.ParentReferencesLabel = nil
		testTranslation.OtherParentField = nil

		label := testTranslation.GetLabel()
		assert.EqualValues(t, testBaseLabel, label)
		referencesLabel := testTranslation.GetReferencesLabel(testTranslationMap)
		assert.Nil(t, referencesLabel)

	})

	t.Run("Export Label takes priority of other field", func(t *testing.T) {
		testTranslation.IsNote = true
		testTranslation.IsOtherType = true
		parentReferenceLabel := "References Label"
		testTranslation.ParentReferencesLabel = &parentReferenceLabel
		exportLabel := "Export Label"
		testTranslation.ExportLabel = &exportLabel
		label := testTranslation.GetLabel()
		assert.EqualValues(t, exportLabel, label)

		parentExportLabel := "Parent Export Label"
		parentTranslationTest.ExportLabel = &parentExportLabel

		referencesLabel := testTranslation.GetReferencesLabel(testTranslationMap)
		assert.EqualValues(t, &parentReferenceLabel, referencesLabel)
	})
	t.Run("Parent other field will Favor Export Label over regular label for references label", func(t *testing.T) {
		//Changes (Testing) update this, I think it is a race condition error because it is using it's own thing
		transOtherTranslation := testTranslation
		transOtherTranslation.IsNote = true
		transOtherTranslation.IsOtherType = true
		transOtherTranslation.OtherParentField = &otherParentField

		transOtherTranslation.ParentReferencesLabel = nil
		exportLabel := "Export Label"
		transOtherTranslation.ExportLabel = &exportLabel
		label := transOtherTranslation.GetLabel()
		assert.EqualValues(t, exportLabel, label)

		// Update the map to have the updated parent which has an export label
		parentExportLabel := "Parent Export Label"
		parentTranslationTest.ExportLabel = &parentExportLabel
		updatedTranslationMap := map[string]ITranslationField{
			otherParentField: parentTranslationTest,
		}

		referencesLabel := transOtherTranslation.GetReferencesLabel(updatedTranslationMap)
		assert.EqualValues(t, &parentExportLabel, referencesLabel)
	})

}

func TestGetOptions(t *testing.T) {
	label := "Hooray, you got the label from the parent"
	dbField := "db_field_name"
	field1Key := "hooray"
	field1Value := "value1"

	field2Key := "boo"
	field2Value := "value2"

	TranslationField := TranslationFieldWithOptions{
		TranslationFieldBase: TranslationFieldBase{
			DbField: dbField,

			Label:                 label,
			ReadOnlyLabel:         nil,
			SubLabel:              nil,
			MultiSelectLabel:      nil,
			IsArray:               false,
			DataType:              TDTString,
			FormType:              TFTText,
			IsNote:                false,
			IsOtherType:           false,
			OtherParentField:      nil,
			ParentReferencesLabel: nil,
		},
		translationOptionRelation: translationOptionRelation{
			Options: map[string]interface{}{
				field1Key: field1Value,
				field2Key: field2Value,
			},
		},
	}
	assert := assert.New(t)

	// Get options, assert that there are two (the regular options)
	options, hasOptions := TranslationField.GetOptions()
	assert.True(hasOptions)
	assert.Len(options, 2)
	assert.EqualValues(field1Value, options[field1Key])
	assert.EqualValues(field2Value, options[field2Key])

	field1ValueExport := "ExportOption"
	// Add export options and assert they are retrieved
	TranslationField.ExportOptions = map[string]interface{}{
		field1Key: field1ValueExport,
	}
	options2, hasOptions2 := TranslationField.GetOptions()
	assert.True(hasOptions2)
	assert.Len(options2, 1)
	assert.EqualValues(field1ValueExport, options2[field1Key])

}
