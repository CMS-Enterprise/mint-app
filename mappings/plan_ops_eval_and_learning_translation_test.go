package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanOpsEvalAndLearningTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanOpsEvalAndLearningTranslation, models.PlanOpsEvalAndLearning{}, taskListStructExcludeFields)
}
