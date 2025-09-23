package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOMilestoneNoteTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, MTOMilestoneNoteTranslation, models.MTOMilestoneNote{}, taskListStructExcludeFields)
}
