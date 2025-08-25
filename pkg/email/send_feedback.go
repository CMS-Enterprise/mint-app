package email

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
