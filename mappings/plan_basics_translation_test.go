package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanBasicsTranslation(t *testing.T) {

	assertAllTranslationDataGeneric(t, PlanBasicsTranslation, models.PlanBasics{}, taskListStructExcludeFields)
}
