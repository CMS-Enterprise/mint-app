package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanGeneralCharacteristicsTranslation(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "ResemblesExistingModelOtherSelected", "ParticipationInModelPreconditionOtherSelected")
	// ResemblesExistingModelOtherSelected and ParticipationInModelPreconditionOtherSelected are not translated on the frontend at all, it isn't needed as a translation
	assertAllTranslationDataGeneric(t, PlanGeneralCharacteristicsTranslation, models.PlanGeneralCharacteristics{}, excludedFields)
}
