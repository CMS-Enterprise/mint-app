package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// PlanTaskNewAvailableTemplateName is the template name definition for the corresponding email template
const PlanTaskNewAvailableTemplateName string = "plan_task_new_available"

// PlanTaskCompletedTemplateName is the template name definition for the corresponding email template
const PlanTaskCompletedTemplateName string = "plan_task_completed"

//go:embed templates/plan_task_new_available_subject.html
var planTaskNewAvailableSubjectTemplate string

//go:embed templates/plan_task_new_available_body.html
var planTaskNewAvailableBodyTemplate string

//go:embed templates/plan_task_completed_subject.html
var planTaskCompletedSubjectTemplate string

//go:embed templates/plan_task_completed_body.html
var planTaskCompletedBodyTemplate string

// PlanTaskNewAvailableSubjectContent defines the parameters necessary for the corresponding email subject
type PlanTaskNewAvailableSubjectContent struct {
	ModelName string
}

// PlanTaskCompletedSubjectContent defines the parameters necessary for the corresponding email subject
type PlanTaskCompletedSubjectContent struct {
	ModelName string
}

// PlanTaskNewAvailableBodyContent defines the parameters necessary for the corresponding email body
type PlanTaskNewAvailableBodyContent struct {
	ClientAddress string
	ModelID       string
	ModelName     string
	TaskList      []string
	IsModelLead   bool
}

// PlanTaskCompletedBodyContent defines the parameters necessary for the corresponding email body
type PlanTaskCompletedBodyContent struct {
	ClientAddress string
	ModelID       string
	ModelName     string
	TaskName      string
	IsModelLead   bool
}

type planTaskEmails struct {
	// The email to be sent when new plan tasks are available
	NewAvailable *emailtemplates.GenEmailTemplate[PlanTaskNewAvailableSubjectContent, PlanTaskNewAvailableBodyContent]

	// The email to be sent when a plan task is completed
	Completed *emailtemplates.GenEmailTemplate[PlanTaskCompletedSubjectContent, PlanTaskCompletedBodyContent]
}

// PlanTask is the collection of all plan task related email templates
var PlanTask = planTaskEmails{
	NewAvailable: NewEmailTemplate[PlanTaskNewAvailableSubjectContent, PlanTaskNewAvailableBodyContent](
		PlanTaskNewAvailableTemplateName,
		planTaskNewAvailableSubjectTemplate,
		planTaskNewAvailableBodyTemplate,
	),
	Completed: NewEmailTemplate[PlanTaskCompletedSubjectContent, PlanTaskCompletedBodyContent](
		PlanTaskCompletedTemplateName,
		planTaskCompletedSubjectTemplate,
		planTaskCompletedBodyTemplate,
	),
}
