package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOMilestoneTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, MTOMilestoneTranslation, models.MTOMilestone{}, taskListStructExcludeFields)
}
