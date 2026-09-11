package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// WaiverAssessmentSurveyCompletedTemplateName is the template name for the waiver assessment survey completed email
const WaiverAssessmentSurveyCompletedTemplateName string = "waiver_assessment_survey_completed"

//go:embed templates/waiver_assessment_survey_completed_body.html
var waiverAssessmentSurveyCompletedBodyTemplate string

//go:embed templates/waiver_assessment_survey_completed_subject.html
var waiverAssessmentSurveyCompletedSubjectTemplate string

type waiverAssessmentSurveyEmails struct {
	// The email to be sent when a waiver assessment survey is marked complete
	Completed *emailtemplates.GenEmailTemplate[WaiverAssessmentSurveyCompletedSubjectContent, WaiverAssessmentSurveyCompletedBodyContent]
}

var WaiverAssessmentSurvey = waiverAssessmentSurveyEmails{
	Completed: NewEmailTemplate[WaiverAssessmentSurveyCompletedSubjectContent, WaiverAssessmentSurveyCompletedBodyContent](
		WaiverAssessmentSurveyCompletedTemplateName,
		waiverAssessmentSurveyCompletedSubjectTemplate,
		waiverAssessmentSurveyCompletedBodyTemplate,
	),
}
