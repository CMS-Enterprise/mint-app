package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanOpsEvalAndLearningTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanOpsEvalAndLearningTranslation, models.PlanOpsEvalAndLearning{}, taskListStructExcludeFields)
}
