package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestOperationalSolutionSubtaskTranslation(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "SolutionID")

	assertAllTranslationDataGeneric(t, OperationalSolutionSubtaskTranslation, models.OperationalSolutionSubtask{}, excludedFields)
}
