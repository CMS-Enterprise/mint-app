package email

// WaiverAssessmentSurveyCompletedSubjectContent defines the parameters necessary for the corresponding email subject
type WaiverAssessmentSurveyCompletedSubjectContent struct {
	ModelName string
}

// WaiverAssessmentSurveyCompletedBodyContent defines the parameters necessary for the corresponding email body
type WaiverAssessmentSurveyCompletedBodyContent struct {
	ClientAddress                   string
	ModelName                       string
	ModelID                         string
	MarkedCompletedByUserCommonName string
}
