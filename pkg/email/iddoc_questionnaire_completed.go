package email

// IDDOCQuestionnaireCompletedSubjectContent defines the parameters necessary for the corresponding email subject
type IDDOCQuestionnaireCompletedSubjectContent struct {
	ModelName string
}

// IDDOCQuestionnaireCompletedBodyContent defines the parameters necessary for the corresponding email body
type IDDOCQuestionnaireCompletedBodyContent struct {
	ClientAddress                   string
	ModelName                       string
	ModelID                         string
	MarkedCompletedByUserCommonName string
	ShowFooter                      bool
}
