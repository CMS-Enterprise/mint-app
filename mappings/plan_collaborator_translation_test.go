package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanCollaboratorsTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanCollaboratorTranslation, models.PlanCollaborator{}, taskListStructExcludeFields)
}
