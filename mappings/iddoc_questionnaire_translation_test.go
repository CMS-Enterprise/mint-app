package mappings

import (
	_ "embed"
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestIddocQuestionnaireTranslation(t *testing.T) {
	// Needed is a metadata field that controls whether the questionnaire is needed, not a form field
	// IsIDDOCQuestionnaireComplete, CompletedBy and CompletedDts are completion metadata filled automatically
	// LoadType is being removed from the schema
	excludedFields := append(taskListStructExcludeFields, "Needed", "IsIDDOCQuestionnaireComplete", "CompletedBy", "CompletedDts", "LoadType")
	assertAllTranslationDataGeneric(t, IddocQuestionnaireTranslation, models.IDDOCQuestionnaire{}, excludedFields)
}
