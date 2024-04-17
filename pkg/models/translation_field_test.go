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
			IsNote:                true,
			IsOtherType:           false,
			OtherParentField:      &otherParentField,
			ParentReferencesLabel: nil,
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

	label := testTranslation.GetLabel(testTranslationMap)
	//Changes: (Translations) Should GetLabel return an error ever?

	assert.EqualValues(t, parentLabel, label)
}
