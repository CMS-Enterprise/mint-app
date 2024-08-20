package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestModelPlanTranslation(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "PreviousSuggestedPhase")
	assertAllTranslationDataGeneric(t, ModelPlanTranslation, models.ModelPlan{}, excludedFields)
}
