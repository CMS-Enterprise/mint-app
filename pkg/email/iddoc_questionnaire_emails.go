package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// IDDOCQuestionnaireCompletedTemplateName is the template name for the IDDOC questionnaire completed email
const IDDOCQuestionnaireCompletedTemplateName string = "iddoc_questionnaire_completed"

//go:embed templates/iddoc_questionnaire_completed_body.html
var iddocQuestionnaireCompletedBodyTemplate string

//go:embed templates/iddoc_questionnaire_completed_subject.html
var iddocQuestionnaireCompletedSubjectTemplate string

type iddocQuestionnaireEmails struct {
	// The email to be sent when an IDDOC questionnaire is marked complete
	Completed *emailtemplates.GenEmailTemplate[IDDOCQuestionnaireCompletedSubjectContent, IDDOCQuestionnaireCompletedBodyContent]
}

var IDDOCQuestionnaire = iddocQuestionnaireEmails{
	Completed: NewEmailTemplate[IDDOCQuestionnaireCompletedSubjectContent, IDDOCQuestionnaireCompletedBodyContent](
		IDDOCQuestionnaireCompletedTemplateName,
		iddocQuestionnaireCompletedSubjectTemplate,
		iddocQuestionnaireCompletedBodyTemplate,
	),
}
