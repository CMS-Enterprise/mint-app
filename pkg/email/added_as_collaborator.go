package email

// AddedAsCollaboratorSubjectContent defines the parameters necessary for the corresponding email subject
type AddedAsCollaboratorSubjectContent struct {
	ModelName string
}

// AddedAsCollaboratorBodyContent defines the parameters necessary for the corresponding email body
type AddedAsCollaboratorBodyContent struct {
	ModelName   string
	ModelURL    string
	UnfollowURL string
}
