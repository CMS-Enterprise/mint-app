package email

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
