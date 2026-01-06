package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// MTOSolutionSelectedTemplateName is the template name for the solution selected email that is sent to an MTO solution POCS
const MTOSolutionSelectedTemplateName string = "mto_solution_selected"

//go:embed templates/mto_solution_selected_body.html
var mtoSolutionSelectedBodyTemplate string

//go:embed templates/mto_solution_selected_subject.html
var mtoSolutionSelectedSubjectTemplate string

type mtoSolutionEmails struct {
	// The email to be sent when an MTO solution is selected
	Selected *emailtemplates.GenEmailTemplate[MTOSolutionSelectedSubjectContent, MTOSolutionSelectedBodyContent]
}

var mtoSolutions = mtoSolutionEmails{
	Selected: NewEmailTemplate[MTOSolutionSelectedSubjectContent, MTOSolutionSelectedBodyContent](
		MTOSolutionSelectedTemplateName,
		mtoSolutionSelectedSubjectTemplate,
		mtoSolutionSelectedBodyTemplate,
	),
}
