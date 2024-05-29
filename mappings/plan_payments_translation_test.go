package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanPaymentsTranslation(t *testing.T) {
	translation, err := PlanPaymentsTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestPlanPaymentsTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanPaymentsTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestPlanPaymentsTranslationCoverage(t *testing.T) {
	translation, err := PlanPaymentsTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

	assertTranslationStructCoverage(t, tMap, models.PlanPayments{}, taskListStructExcludeFields)
}
