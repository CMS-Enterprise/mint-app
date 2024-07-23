package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
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

	assertTranslationFields(t, translation)

}

func TestPlanDocumentSolutionLinkTranslationCoverage(t *testing.T) {
	assertTranslationStructCoverageGeneric(t, PlanDocumentSolutionLinkTranslation, models.PlanDocumentSolutionLink{}, taskListStructExcludeFields)
}
