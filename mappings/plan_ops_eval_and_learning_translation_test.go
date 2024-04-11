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

}
