package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanTDLTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanTDLTranslation, models.PlanTDL{}, taskListStructExcludeFields)
}
