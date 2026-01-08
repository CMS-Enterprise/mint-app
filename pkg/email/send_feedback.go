package email

import (
	_ "embed"
)

// SendFeedbackTemplateName is the template name definition of the send feedback email template
const SendFeedbackTemplateName string = "send_feedback"

//go:embed templates/send_feedback_subject.html
var sendFeedbackSubjectTemplate string

//go:embed templates/send_feedback_body.html
var sendFeedbackBodyTemplate string

// SendFeedbackSubjectContent defines the parameters necessary for the corresponding email subject
type SendFeedbackSubjectContent struct{}

// SendFeedbackBodyContent defines the parameters necessary for the corresponding email body
type SendFeedbackBodyContent struct {
	ClientAddress         string
	IsAnonymousSubmission bool
	ReporterName          string
	ReporterEmail         string
	AllowContact          string
	CMSRole               string
	MINTUsedFor           []string
	SystemEasyToUse       string
	HowSatisfied          string
	HowCanWeImprove       string
}

// sendFeedback is the struct that holds send feedback email templates
var sendFeedback = NewEmailTemplate[SendFeedbackSubjectContent, SendFeedbackBodyContent](
	SendFeedbackTemplateName,
	sendFeedbackSubjectTemplate,
	sendFeedbackBodyTemplate,
)
