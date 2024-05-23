package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExistingModelLinkTranslation(t *testing.T) {
	translation, err := ExistingModelLinkTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestExistingModelLinkTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := ExistingModelLinkTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}
