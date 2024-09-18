package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanBasicsTranslation(t *testing.T) {

	assertAllTranslationDataGeneric(t, PlanBasicsTranslation, models.PlanBasics{}, taskListStructExcludeFields)
}
