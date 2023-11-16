package email

import "html/template"

// PlanDiscussionTaggedUserSubjectContent defines the parameters necessary for the corresponding email subject
type PlanDiscussionTaggedUserSubjectContent struct {
	ModelName         string
	ModelAbbreviation string
}

// PlanDiscussionTaggedUserBodyContent defines the parameters necessary for the corresponding email body
type PlanDiscussionTaggedUserBodyContent struct {
	ClientAddress     string
	DiscussionID      string
	UserName          string
	DiscussionContent template.HTML // the rich text content of the discussion. It is written as template.HTML to allow it be rendered as HTML with the templating library
	ModelID           string
	ModelName         string
	ModelAbbreviation string
	Role              string
}
