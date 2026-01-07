package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

// utilityEmails holds all utility email templates (report a problem and send feedback)
type utilityEmails struct {
	ReportAProblem *emailtemplates.GenEmailTemplate[ReportAProblemSubjectContent, ReportAProblemBodyContent]
	SendFeedback   *emailtemplates.GenEmailTemplate[SendFeedbackSubjectContent, SendFeedbackBodyContent]
}

// UtilityEmails is the exported utility emails registry. It holds emails that are related more to the app instead of a specific entity.
var UtilityEmails = utilityEmails{
	ReportAProblem: reportAProblem,
	SendFeedback:   sendFeedback,
}
