package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanDocumentTranslation(t *testing.T) {
	translation, err := PlanDocumentTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestPlanDocumentTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanDocumentTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestPlanDocumentTranslationCoverage(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "FileSize", "VirusScanned", "VirusClean", "DeletedAt", "Bucket", "FileKey")

	assertTranslationStructCoverageGeneric(t, PlanDocumentTranslation, models.PlanDocument{}, excludedFields)
}
