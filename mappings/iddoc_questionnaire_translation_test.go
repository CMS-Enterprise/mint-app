package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestIddocQuestionnaireTranslation(t *testing.T) {
	var excludeNeeded []string = append(taskListStructExcludeFields, "Needed")
	excludedFields := excludeNeeded

	assertAllTranslationDataGeneric(t, IddocQuestionnaireTranslation, models.IDDOCQuestionnaire{}, excludedFields)
}
