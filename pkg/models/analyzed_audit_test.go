package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAnalyzedPlanSectionsHumanizeIncludesWaiverAssessmentSurveyComplete(t *testing.T) {
	t.Parallel()

	sections := &AnalyzedPlanSections{
		WaiverAssessmentSurveyMarkedComplete: true,
	}

	assert.False(t, sections.IsEmpty())
	assert.Contains(t, sections.Humanize(), AnalyzedPlanSectionsHumanizedWaiverAssessmentSurveyComplete)
}
