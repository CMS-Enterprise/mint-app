package email

import (
	_ "embed"
)

// ReportAProblemTemplateName is the template name definition for the corresponding email template
const ReportAProblemTemplateName string = "report_a_problem"

//go:embed templates/report_a_problem_subject.html
var reportAProblemSubjectTemplate string

//go:embed templates/report_a_problem_body.html
var reportAProblemBodyTemplate string

// ReportAProblemSubjectContent defines the parameters necessary for the corresponding email subject
type ReportAProblemSubjectContent struct{}

// ReportAProblemBodyContent defines the parameters necessary for the corresponding email body
type ReportAProblemBodyContent struct {
	ClientAddress         string
	IsAnonymousSubmission bool
	ReporterName          string
	ReporterEmail         string
	AllowContact          string
	Section               string
	WhatDoing             string
	WhatWentWrong         string
	Severity              string
}

// reportAProblem is the struct that holds report a problem email templates
var reportAProblem = NewEmailTemplate[ReportAProblemSubjectContent, ReportAProblemBodyContent](
	ReportAProblemTemplateName,
	reportAProblemSubjectTemplate,
	reportAProblemBodyTemplate,
)
