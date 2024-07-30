package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestOperationalSolutionTranslation(t *testing.T) {
	/*
		Operational NeedID is captured in metadata
		SolutionType is captured in MetaData
		IsCommonSolution isn't a database field, but data returned in the query

	*/
	excludedFields := append(taskListStructExcludeFields, "OperationalNeedID", "SolutionType", "IsCommonSolution")
	assertAllTranslationDataGeneric(t, OperationalSolutionTranslation, models.OperationalSolution{}, excludedFields)
}
