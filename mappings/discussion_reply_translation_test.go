package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestDiscussionReplyTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, DiscussionReplyTranslation, models.PlanDiscussion{}, taskListStructExcludeFields)
}
