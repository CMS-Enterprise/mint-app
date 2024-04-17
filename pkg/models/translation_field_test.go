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
		label := testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, testBaseLabel, label)
	})
	t.Run("Other parent field is used if note or if other", func(t *testing.T) {
		// if isNote or if isOther use the
		testTranslation.IsNote = true
		label := testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, parentLabel, label)
		testTranslation.IsOtherType = true
		testTranslation.IsNote = false
		label = testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, parentLabel, label)
	})

	t.Run("Other parent field is used if note or if other. If a parent field isn't found, use the base label", func(t *testing.T) {
		// if isNote or if isOther use the
		testTranslation.IsNote = true
		parentField := "false_field_name"
		testTranslation.OtherParentField = &parentField
		label := testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, testBaseLabel, label)
		testTranslation.IsOtherType = true
		testTranslation.IsNote = false
		label = testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, testBaseLabel, label)
	})
	t.Run("ParentReferencesLabel  is prioritized over Other Parent Field if note or if other", func(t *testing.T) {
		testTranslation.IsNote = true
		referenceLabel := "References Label"
		testTranslation.ParentReferencesLabel = &referenceLabel

		label := testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, referenceLabel, label)
		testTranslation.IsOtherType = true
		testTranslation.IsNote = false
		label = testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, referenceLabel, label)
	})
	t.Run("If parentReferencesLabel and Other Parent Field are null, use base label", func(t *testing.T) {
		testTranslation.IsNote = true
		testTranslation.ParentReferencesLabel = nil
		testTranslation.OtherParentField = nil

		label := testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, testBaseLabel, label)

	})

	t.Run("Export Label takes priority of other field", func(t *testing.T) {
		testTranslation.IsNote = true
		testTranslation.IsOtherType = true
		exportLabel := "Export Label"
		testTranslation.ExportLabel = &exportLabel
		label := testTranslation.GetLabel(testTranslationMap)
		assert.EqualValues(t, exportLabel, label)
	})

}
