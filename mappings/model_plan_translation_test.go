package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestModelPlanTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, ModelPlanTranslation, models.ModelPlan{}, taskListStructExcludeFields)
}
