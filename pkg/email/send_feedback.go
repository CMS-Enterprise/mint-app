package email

// SendFeedbackSubjectContent defines the parameters necessary for the corresponding email subject
type SendFeedbackSubjectContent struct{}

// SendFeedbackBodyContent defines the parameters necessary for the corresponding email body
type SendFeedbackBodyContent struct {
	IsAnonymousSubmission bool
	ReporterName          string
	ReporterEmail         string
	AllowContact          bool
	CMSRole               string
	MINTUsedFor           []string
	SystemEasyToUse       string
	HowSatisfied          string
	HowCanWeImprove       string
}
