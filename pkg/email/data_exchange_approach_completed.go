package email

// DataExchangeApproachCompletedSubjectContent defines the parameters necessary for the corresponding email subject
type DataExchangeApproachCompletedSubjectContent struct {
	ModelName string
}

// DataExchangeApproachCompletedBodyContent defines the parameters necessary for the corresponding email body
type DataExchangeApproachCompletedBodyContent struct {
	ClientAddress                   string
	ModelName                       string
	ModelID                         string
	MarkedCompletedByUserCommonName string
	ShowFooter                      bool
}
