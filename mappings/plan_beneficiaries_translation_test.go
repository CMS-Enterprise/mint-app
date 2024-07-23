package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanBeneficiariesTranslation(t *testing.T) {
	translation, err := PlanBeneficiariesTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestPlanBeneficiariesTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanBeneficiariesTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestPlanBeneficiariesTranslationCoverage(t *testing.T) {
	translation, err := PlanBeneficiariesTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

	assertTranslationStructCoverage(t, tMap, models.PlanBeneficiaries{}, taskListStructExcludeFields)
}
