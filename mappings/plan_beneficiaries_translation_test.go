package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanBeneficiariesTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanBeneficiariesTranslation, models.PlanBeneficiaries{}, taskListStructExcludeFields)
}
