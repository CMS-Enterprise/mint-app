package email

// SolutionSelectedSubjectContent defines the parameters necessary for the corresponding email subject
type SolutionSelectedSubjectContent struct {
	ModelName    string
	SolutionName string
}

// SolutionSelectedBodyContent defines the parameters necessary for the corresponding email body
type SolutionSelectedBodyContent struct {
	ClientAddress  string
	FilterViewLink string // TODO: SW, we could build the link in the template instead if preferred
	SolutionName   string
	SolutionStatus string
	ModelLeadNames []string
	NeedName       string
	// ModelID           string
	ModelName         string
	ModelAbbreviation string
	ModelStatus       string
	// TODO: SW, should we make the contact link in the footer be dynamic based on an email passed here?
}
