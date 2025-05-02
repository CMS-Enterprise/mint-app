package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestMTOSolutionTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, MTOSolutionTranslation, models.MTOSolution{}, taskListStructExcludeFields)
}
