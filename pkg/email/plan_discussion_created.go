package email

// PlanDiscussionCreatedSubjectContent defines the parameters necessary for the corresponding email subject
type PlanDiscussionCreatedSubjectContent struct {
	DiscussionContent string
}

// PlanDiscussionCreatedBodyContent defines the parameters necessary for the corresponding email body
type PlanDiscussionCreatedBodyContent struct {
	ClientAddress     string
	DiscussionID      string
	CreatorUserName   string
	DiscussionContent string
	ModelID           string
	ModelName         string
}
