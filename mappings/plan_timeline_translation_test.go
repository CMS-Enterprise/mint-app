package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanPlanTimelineTranslation(t *testing.T) {

	assertAllTranslationDataGeneric(t, PlanTimelineTranslation, models.PlanTimeline{}, taskListStructExcludeFields)
}
