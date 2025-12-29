package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionPOCRemovedTemplateName is the template name for the POC removed email
const MTOCommonSolutionPOCRemovedTemplateName = "mto_common_solution_poc_removed"

//go:embed templates/mto_common_solution_poc_removed_subject.html
var MTOCommonSolutionPOCRemovedSubjectTemplate string

//go:embed templates/mto_common_solution_poc_removed_body.html
var MTOCommonSolutionPOCRemovedBodyTemplate string

// MTOCommonSolutionPOCRemovedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionPOCRemovedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// MTOCommonSolutionPOCRemovedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionPOCRemovedBodyContent struct {
	ClientAddress      string
	Key                string
	SolutionAcronym    string
	SolutionName       string
	RemovedContactType string
	RemovedContactName string
}

// NewMTOCommonSolutionPOCRemovedBodyContent constructs the email body content for a point of contact removal.
func NewMTOCommonSolutionPOCRemovedBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
	solutionName string,
) MTOCommonSolutionPOCRemovedBodyContent {
	RemovedContactType := "Point of Contact"
	if contact.IsTeam {
		RemovedContactType = "Team Mailbox"
	}

	return MTOCommonSolutionPOCRemovedBodyContent{
		ClientAddress:      clientAddress,
		Key:                string(contact.Key),
		SolutionAcronym:    string(contact.Key),
		SolutionName:       solutionName,
		RemovedContactType: RemovedContactType,
		RemovedContactName: contact.Name,
	}
}
