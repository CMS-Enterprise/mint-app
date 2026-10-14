package email

import (
	_ "embed"
	"html/template"
	"time"
)

// ModelFollowerUpdateTemplateName is the template name definition for the corresponding email template
const ModelFollowerUpdateTemplateName string = "model_follower_update"

//go:embed templates/model_follower_update_subject.html
var modelFollowerUpdateSubjectTemplate string

//go:embed templates/model_follower_update_body.html
var modelFollowerUpdateBodyTemplate string

// ModelFollowerUpdateSubjectContent defines the parameters necessary for the corresponding email subject
type ModelFollowerUpdateSubjectContent struct {
	ModelShortName *string
}

// ModelFollowerUpdateBodyContent defines the parameters necessary for the corresponding email body
type ModelFollowerUpdateBodyContent struct {
	ClientAddress    string
	ModelID          string
	ModelName        string
	ModelShortName   *string
	ModelCategories  []string
	ModelStatus      string
	ModelLastUpdated time.Time
	ModelLeads       []string
	Content          template.HTML // the sanitized rich text message. It is written as template.HTML to allow it be rendered as HTML with the templating library
}
