package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPlanDocumentSolutionLinkTranslation(t *testing.T) {
	translation, err := PlanDocumentSolutionLinkTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestPlanDocumentSolutionLinkTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanDocumentSolutionLinkTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}
