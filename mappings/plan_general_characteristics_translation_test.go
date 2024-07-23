package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanGeneralCharacteristicsTranslation(t *testing.T) {
	translation, err := PlanGeneralCharacteristicsTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestPlanGeneralCharacteristicsTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanGeneralCharacteristicsTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestPlanGeneralCharacteristicsTranslationCoverage(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "ResemblesExistingModelOtherSelected", "ParticipationInModelPreconditionOtherSelected")
	// ResemblesExistingModelOtherSelected and ParticipationInModelPreconditionOtherSelected are not translated on the frontend at all, it isn't needed as a translation

	assertTranslationStructCoverageGeneric(t, PlanGeneralCharacteristicsTranslation, models.PlanGeneralCharacteristics{}, excludedFields)
}
