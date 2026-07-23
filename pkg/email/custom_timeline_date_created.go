package email

import _ "embed"

// CustomTimelineDateCreatedTemplateName is the template name definition for the corresponding email template
const CustomTimelineDateCreatedTemplateName string = "custom_timeline_date_created"

//go:embed templates/custom_timeline_date_created_subject.html
var customTimelineDateCreatedSubjectTemplate string

//go:embed templates/custom_timeline_date_created_body.html
var customTimelineDateCreatedBodyTemplate string

// CustomTimelineDateCreatedSubjectContent defines the parameters necessary for the corresponding email subject
type CustomTimelineDateCreatedSubjectContent struct {
	ModelName string
}

// CustomTimelineDateCreatedBodyContent defines the parameters necessary for the corresponding email body
type CustomTimelineDateCreatedBodyContent struct {
	ClientAddress                 string
	ModelName                     string
	ModelID                       string
	UserName                      string
	CustomTimelineDateTitle       string
	CustomTimelineDateDescription string
	CustomTimelineDate            string
}
