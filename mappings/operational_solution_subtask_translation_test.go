package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestOperationalSolutionSubtaskTranslation(t *testing.T) {
	translation, err := OperationalSolutionSubtaskTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestOperationalSolutionSubtaskTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := OperationalSolutionSubtaskTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}
