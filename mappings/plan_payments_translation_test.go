package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanPaymentsTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanPaymentsTranslation, models.PlanPayments{}, taskListStructExcludeFields)
}
