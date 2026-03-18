package email

// MTOReadyForReviewSubjectContent defines the parameters necessary for the corresponding email subject
type MTOReadyForReviewSubjectContent struct {
	ModelName string
}

// MTOReadyForReviewBodyContent defines the parameters necessary for the corresponding email body
type MTOReadyForReviewBodyContent struct {
	ClientAddress                  string
	ModelName                      string
	ModelID                        string
	MarkedReadyForReviewByUserName string
	ShowFooter                     bool
}
