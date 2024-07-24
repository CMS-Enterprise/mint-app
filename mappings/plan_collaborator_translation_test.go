package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanCollaboratorsTranslation(t *testing.T) {
	assertAllTranslationDataGeneric(t, PlanCollaboratorTranslation, models.PlanCollaborator{}, taskListStructExcludeFields)
}
