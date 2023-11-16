package email

import "html/template"

// PlanDiscussionCreatedSubjectContent defines the parameters necessary for the corresponding email subject
type PlanDiscussionCreatedSubjectContent struct {
	ModelName         string
	ModelAbbreviation string
	UserName          string
}

// PlanDiscussionCreatedBodyContent defines the parameters necessary for the corresponding email body
type PlanDiscussionCreatedBodyContent struct {
	ClientAddress     string
	DiscussionID      string
	UserName          string
	DiscussionContent template.HTML // the rich text content of the discussion. It is written as template.HTML to allow it be rendered as HTML with the templating library
	ModelID           string
	ModelName         string
	Role              string
}
