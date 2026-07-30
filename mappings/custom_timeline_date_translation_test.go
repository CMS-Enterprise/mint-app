package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestCustomTimelineDateTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, CustomTimelineDateTranslation, models.CustomTimelineDate{}, taskListStructExcludeFields)
}
