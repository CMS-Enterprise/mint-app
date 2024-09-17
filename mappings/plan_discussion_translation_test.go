package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanDiscussionTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanDiscussionTranslation, models.PlanDiscussion{}, taskListStructExcludeFields)
}
