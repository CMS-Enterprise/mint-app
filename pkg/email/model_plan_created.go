package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// ModelPlanCreatedTemplateName is the template name definition for the corresponding email template
const ModelPlanCreatedTemplateName string = "model_plan_created"

//go:embed templates/model_plan_created_subject.html
var modelPlanCreatedSubjectTemplate string

//go:embed templates/model_plan_created_body.html
var modelPlanCreatedBodyTemplate string

type modelPlanEmails struct {
	// The email to be sent when a model plan is created
	Created *emailtemplates.GenEmailTemplate[ModelPlanCreatedSubjectContent, ModelPlanCreatedBodyContent]
}

var ModelPlan = modelPlanEmails{
	Created: NewEmailTemplate[ModelPlanCreatedSubjectContent, ModelPlanCreatedBodyContent](
		ModelPlanCreatedTemplateName,
		modelPlanCreatedSubjectTemplate,
		modelPlanCreatedBodyTemplate,
	),
}

// ModelPlanCreatedSubjectContent defines the parameters necessary for the corresponding email subject
type ModelPlanCreatedSubjectContent struct {
	ModelName string
}

// ModelPlanCreatedBodyContent defines the parameters necessary for the corresponding email body
type ModelPlanCreatedBodyContent struct {
	ClientAddress string
	ModelName     string
	ModelID       string
	UserName      string
	IsGeneralUser bool
}
