package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestDiscussionReplyTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, DiscussionReplyTranslation, models.PlanDiscussion{}, taskListStructExcludeFields)
}
