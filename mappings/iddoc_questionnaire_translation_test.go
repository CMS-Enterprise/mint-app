package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestIddocQuestionnaireTranslation(t *testing.T) {
	excludedFields := taskListStructExcludeFields
	assertAllTranslationDataGeneric(t, IddocQuestionnaireTranslation, models.IDDOCQuestionnaire{}, excludedFields)
}
