package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanDataExchangeApproachTranslation(t *testing.T) {
	excludedFields := taskListStructExcludeFields

	assertAllTranslationDataGeneric(t, PlanDataExchangeApproachTranslation, models.PlanDataExchangeApproach{}, excludedFields)
}
