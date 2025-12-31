package email

import (
	_ "embed"
	"html/template"
)

// PlanDiscussionTaggedUserTemplateName is the template name definition for the corresponding email template
const PlanDiscussionTaggedUserTemplateName string = "plan_discussion_tagged_user"

//go:embed templates/plan_discussion_tagged_user_subject.html
var planDiscussionTaggedUserSubjectTemplate string

//go:embed templates/plan_discussion_tagged_user_body.html
var planDiscussionTaggedUserBodyTemplate string

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
