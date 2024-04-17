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
