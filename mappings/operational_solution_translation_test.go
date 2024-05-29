package mappings

import (
	_ "embed"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestOperationalSolutionTranslation(t *testing.T) {
	translation, err := OperationalSolutionTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)

}

func TestOperationalSolutionTranslationVerifyFieldsArePopulated(t *testing.T) {
	translation, err := OperationalSolutionTranslation()
	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	assertTranslationFields(t, translation)

}

func TestOperationalSolutionTranslationCoverage(t *testing.T) {
	translation, err := OperationalSolutionTranslation()

	assert.NoError(t, err)
	assert.NotNil(t, translation)

	tMap, err := translation.ToMap()
	assert.NoError(t, err)
	assert.NotNil(t, tMap)
	/*
		Operational NeedID is captured in metadata
		SolutionType is captured in MetaData
		IsCommonSolution isn't a database field, but data returned in the query

	*/
	excludedFields := append(taskListStructExcludeFields, "OperationalNeedID", "SolutionType", "IsCommonSolution")

	assertTranslationStructCoverage(t, tMap, models.OperationalSolution{}, excludedFields)
}
