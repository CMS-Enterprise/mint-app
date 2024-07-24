package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanBeneficiariesTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanBeneficiariesTranslation, models.PlanBeneficiaries{}, taskListStructExcludeFields)
}
