package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanCRTranslation(t *testing.T) {

	assertAllTranslationDataGeneric(t, PlanCRTranslation, models.PlanCR{}, taskListStructExcludeFields)
}
