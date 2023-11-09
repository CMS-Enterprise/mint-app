package email

import "html/template"

// PlanDiscussionTaggedSolutionSubjectContent defines the parameters necessary for the corresponding email subject
type PlanDiscussionTaggedSolutionSubjectContent struct {
	SolutionName      string
	ModelName         string
	ModelAbbreviation string
}

// PlanDiscussionTaggedSolutionBodyContent defines the parameters necessary for the corresponding email body
type PlanDiscussionTaggedSolutionBodyContent struct {
	ClientAddress     string
	DiscussionID      string
	UserName          string
	DiscussionContent template.HTML // the rich text content of the discussion / reply. It is written as template.HTML to allow it be rendered as HTML with the templating library
	ModelID           string
	ModelName         string
	ModelAbbreviation string
	Role              string
	SolutionName      string
}
