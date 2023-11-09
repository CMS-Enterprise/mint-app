package email

import "html/template"

// PlanDiscussionTaggedSolutionSubjectContent defines the parameters necessary for the corresponding email subject
type PlanDiscussionTaggedSolutionSubjectContent struct {
	ModelName         string // TODO UPDATE
	ModelAbbreviation string
	UserName          string
}

// PlanDiscussionTaggedSolutionBodyContent defines the parameters necessary for the corresponding email body
type PlanDiscussionTaggedSolutionBodyContent struct {
	ClientAddress     string
	DiscussionID      string
	UserName          string
	DiscussionContent template.HTML // the rich text content of the discussion. It is written as template.HTML to allow it be rendered as HTML with the templating library
	ModelID           string
	ModelName         string
}
