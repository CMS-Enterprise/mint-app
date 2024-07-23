package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestModelPlanTranslation(t *testing.T) {
	translation, err := ModelPlanTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestModelPlanTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := ModelPlanTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestModelPlanTranslationCoverage(t *testing.T) {
	assertTranslationStructCoverageGeneric(t, ModelPlanTranslation, models.ModelPlan{}, taskListStructExcludeFields)
}
