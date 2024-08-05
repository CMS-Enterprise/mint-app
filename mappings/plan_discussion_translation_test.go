package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanDiscussionTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanDiscussionTranslation, models.PlanDiscussion{}, taskListStructExcludeFields)
}
