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
		testTranslation.IsNote = true
		testTranslation.IsOtherType = true

		testTranslation.ParentReferencesLabel = nil
		exportLabel := "Export Label"
		testTranslation.ExportLabel = &exportLabel
		label := testTranslation.GetLabel()
		assert.EqualValues(t, exportLabel, label)

		// Update the map to have the updated parent which has an export label
		parentExportLabel := "Parent Export Label"
		parentTranslationTest.ExportLabel = &parentExportLabel
		testTranslationMap[otherParentField] = parentTranslationTest

		referencesLabel := testTranslation.GetReferencesLabel(testTranslationMap)
		assert.EqualValues(t, &parentExportLabel, referencesLabel)
	})

}