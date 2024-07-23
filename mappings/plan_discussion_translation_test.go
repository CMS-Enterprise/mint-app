package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanDiscussionTranslation(t *testing.T) {
	translation, err := PlanDiscussionTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestPlanDiscussionTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanDiscussionTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestPlanDiscussionTranslationCoverage(t *testing.T) {
	assertTranslationStructCoverageGeneric(t, PlanDiscussionTranslation, models.PlanDiscussion{}, taskListStructExcludeFields)
}
