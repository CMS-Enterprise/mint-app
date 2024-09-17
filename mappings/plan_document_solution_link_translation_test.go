package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanDocumentSolutionLinkTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanDocumentSolutionLinkTranslation, models.PlanDocumentSolutionLink{}, taskListStructExcludeFields)
}
