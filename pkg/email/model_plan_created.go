package email

// ModelPlanCreatedSubjectContent defines the parameters necessary for the corresponding email subject
type ModelPlanCreatedSubjectContent struct {
	ModelName string
}

// ModelPlanCreatedBodyContent defines the parameters necessary for the corresponding email body
type ModelPlanCreatedBodyContent struct {
	ClientAddress string
	ModelName     string
	ModelID       string
	UserName      string
	ShowFooter    bool
}
