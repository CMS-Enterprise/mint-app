package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanPaymentsTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanPaymentsTranslation, models.PlanPayments{}, taskListStructExcludeFields)
}
