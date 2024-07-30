package mappings

import (
	_ "embed"
	"testing"

	"github.com/cmsgov/mint-app/pkg/models"
)

func TestOperationalNeedTranslation(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "NeedType")
	assertAllTranslationDataGeneric(t, OperationalNeedTranslation, models.OperationalNeed{}, excludedFields)
}
