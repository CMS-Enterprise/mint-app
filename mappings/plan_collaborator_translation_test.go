package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestPlanCollaboratorsTranslation(t *testing.T) {
	translation, err := PlanCollaboratorTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestPlanCollaboratorsTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := PlanCollaboratorTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestPlanCollaboratorTranslationCoverage(t *testing.T) {
	assertTranslationStructCoverageGeneric(t, PlanCollaboratorTranslation, models.PlanCollaborator{}, taskListStructExcludeFields)
}
