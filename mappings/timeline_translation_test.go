package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestTimelineTranslation(t *testing.T) {

	assertAllTranslationDataGeneric(t, TimelineTranslation, models.Timeline{}, taskListStructExcludeFields)
}
