package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// PlanTaskNewAvailableTemplateName is the template name definition for the corresponding email template
const PlanTaskNewAvailableTemplateName string = "plan_task_new_available"

//go:embed templates/plan_task_new_available_subject.html
var planTaskNewAvailableSubjectTemplate string

//go:embed templates/plan_task_new_available_body.html
var planTaskNewAvailableBodyTemplate string

// PlanTaskNewAvailableSubjectContent defines the parameters necessary for the corresponding email subject
type PlanTaskNewAvailableSubjectContent struct {
	ModelName string
}

// PlanTaskNewAvailableBodyContent defines the parameters necessary for the corresponding email body
type PlanTaskNewAvailableBodyContent struct {
	ClientAddress string
	ModelID       string
	ModelName     string
	TaskList      []string
}

type planTaskEmails struct {
	// The email to be sent when new plan tasks are available
	NewAvailable *emailtemplates.GenEmailTemplate[PlanTaskNewAvailableSubjectContent, PlanTaskNewAvailableBodyContent]
}

// PlanTask is the collection of all plan task related email templates
var PlanTask = planTaskEmails{
	NewAvailable: NewEmailTemplate[PlanTaskNewAvailableSubjectContent, PlanTaskNewAvailableBodyContent](
		PlanTaskNewAvailableTemplateName,
		planTaskNewAvailableSubjectTemplate,
		planTaskNewAvailableBodyTemplate,
	),
}
