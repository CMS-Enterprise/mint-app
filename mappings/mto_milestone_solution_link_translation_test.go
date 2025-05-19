package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOMilestoneSolutionLinkTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, MTOMilestoneSolutionLinkTranslation, models.MTOMilestoneSolutionLink{}, taskListStructExcludeFields)
}
