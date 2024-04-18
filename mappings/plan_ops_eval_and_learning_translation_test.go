package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"
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

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}
