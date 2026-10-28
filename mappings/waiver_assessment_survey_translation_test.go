package mappings

import (
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestWaiverAssessmentSurveyTranslation(t *testing.T) {
	excludedFields := append(taskListStructExcludeFields, "CompletedBy", "CompletedDts")
	assertAllTranslationDataGeneric(
		t,
		WaiverAssessmentSurveyTranslation,
		models.WaiverAssessmentSurvey{},
		excludedFields,
	)
}
