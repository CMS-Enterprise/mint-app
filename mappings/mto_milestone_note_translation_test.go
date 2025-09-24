package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOMilestoneNoteTranslation(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "MTOMilestoneID")
	assertAllTranslationDataGeneric(t, MTOMilestoneNoteTranslation, models.MTOMilestoneNote{}, excludedFields)
}
