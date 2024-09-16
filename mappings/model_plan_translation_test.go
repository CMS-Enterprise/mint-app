package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestModelPlanTranslation(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "PreviousSuggestedPhase")
	assertAllTranslationDataGeneric(t, ModelPlanTranslation, models.ModelPlan{}, excludedFields)
}
