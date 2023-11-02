package email

import "html/template"

// PlanDiscussionCreatedSubjectContent defines the parameters necessary for the corresponding email subject
type PlanDiscussionCreatedSubjectContent struct {
	DiscussionContent string
}

// PlanDiscussionCreatedBodyContent defines the parameters necessary for the corresponding email body
type PlanDiscussionCreatedBodyContent struct {
	ClientAddress     string
	DiscussionID      string
	UserName          string
	DiscussionContent template.HTML
	ModelID           string
	ModelName         string
}
