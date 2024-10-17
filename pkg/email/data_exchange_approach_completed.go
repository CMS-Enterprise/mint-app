package email

// DataExchangeApproachMarkedCompleteSubjectContent defines the parameters necessary for the corresponding email subject
type DataExchangeApproachMarkedCompleteSubjectContent struct {
	ModelName string
}

// DataExchangeApproachMarkedCompleteBodyContent defines the parameters necessary for the corresponding email body
type DataExchangeApproachMarkedCompleteBodyContent struct {
	ClientAddress                   string
	ModelName                       string
	ModelID                         string
	MarkedCompletedByUserCommonName string
	ShowFooter                      bool
}
