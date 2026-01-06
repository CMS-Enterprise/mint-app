package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// MTOMilestoneAssignedTemplateName is the template name for the milestone assigned email
const MTOMilestoneAssignedTemplateName string = "mto_milestone_assigned"

//go:embed templates/mto_milestone_assigned_subject.html
var mtoMilestoneAssignedSubjectTemplate string

//go:embed templates/mto_milestone_assigned_body.html
var mtoMilestoneAssignedBodyTemplate string

type mtoMilestoneEmails struct {
	// The email to be sent when a milestone is assigned
	Assigned *emailtemplates.GenEmailTemplate[MTOMilestoneAssignedSubjectContent, MTOMilestoneAssignedBodyContent]
}

var mtoMilestones = mtoMilestoneEmails{
	Assigned: NewEmailTemplate[MTOMilestoneAssignedSubjectContent, MTOMilestoneAssignedBodyContent](
		MTOMilestoneAssignedTemplateName,
		mtoMilestoneAssignedSubjectTemplate,
		mtoMilestoneAssignedBodyTemplate,
	),
}
