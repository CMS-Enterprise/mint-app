package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestParticipantsAndProvidersTranslation(t *testing.T) {
	translation, err := PlanParticipantsAndProvidersTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestParticipantsAndProvidersTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanParticipantsAndProvidersTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestPlanParticipantsAndProvidersTranslationCoverage(t *testing.T) {
	translation, err := PlanParticipantsAndProvidersTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

	assertTranslationStructCoverage(t, tMap, models.PlanParticipantsAndProviders{}, taskListStructExcludeFields)
}
