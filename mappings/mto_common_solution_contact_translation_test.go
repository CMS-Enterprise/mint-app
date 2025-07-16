package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOCommonSolutionContactTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, MTOCommonSolutionContactTranslation, models.MTOCommonSolutionContact{}, baseStructExcludeFields)
}
