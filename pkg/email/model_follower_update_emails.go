package email

import (
	_ "embed"
	"html/template"
	"time"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// ModelFollowerUpdateTemplateName is the template name definition for the corresponding email template
const ModelFollowerUpdateTemplateName string = "model_follower_update"

//go:embed templates/model_follower_update_subject.html
var modelFollowerUpdateSubjectTemplate string

//go:embed templates/model_follower_update_body.html
var modelFollowerUpdateBodyTemplate string

// ModelFollowerUpdateSubjectContent defines the parameters necessary for the corresponding email subject
type ModelFollowerUpdateSubjectContent struct {
	// ModelAcronym is the model's abbreviation, falling back to the model name when it has none
	ModelAcronym string
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
	// Content is the message, already sanitized by sanitization.SanitizeHTML, so it is rendered unescaped
	Content template.HTML
}

type modelFollowerUpdateEmails struct {
	// The email to be sent to everyone following a model when a model team member sends them a message
	Send *emailtemplates.GenEmailTemplate[ModelFollowerUpdateSubjectContent, ModelFollowerUpdateBodyContent]
}

// ModelFollowerUpdate is the collection of all model follower update related email templates
var ModelFollowerUpdate = modelFollowerUpdateEmails{
	Send: NewEmailTemplate[ModelFollowerUpdateSubjectContent, ModelFollowerUpdateBodyContent](
		ModelFollowerUpdateTemplateName,
		modelFollowerUpdateSubjectTemplate,
		modelFollowerUpdateBodyTemplate,
	),
}
