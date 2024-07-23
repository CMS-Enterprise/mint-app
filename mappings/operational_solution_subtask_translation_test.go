package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
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

	assertTranslationFields(t, translation)

}

func TestOperationalSolutionSubtaskTranslationCoverage(t *testing.T) {
	translation, err := OperationalSolutionSubtaskTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)
	excludedFields := append(taskListStructExcludeFields, "SolutionID")

	assertTranslationStructCoverage(t, tMap, models.OperationalSolutionSubtask{}, excludedFields)
}
