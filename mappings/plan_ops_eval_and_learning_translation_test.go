package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanOpsEvalAndLearningTranslation(t *testing.T) {
	translation, err := PlanOpsEvalAndLearningTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestPlanOpsEvalAndLearningTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanOpsEvalAndLearningTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestPlanOpsEvalAndLearningTranslationCoverage(t *testing.T) {
	translation, err := PlanOpsEvalAndLearningTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

	assertTranslationStructCoverage(t, tMap, models.PlanOpsEvalAndLearning{}, taskListStructExcludeFields)
}
