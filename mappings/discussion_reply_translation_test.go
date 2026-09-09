package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestDiscussionReplyTranslation(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "DiscussionID")
	assertAllTranslationDataGeneric(t, DiscussionReplyTranslation, models.DiscussionReply{}, excludedFields)
}
