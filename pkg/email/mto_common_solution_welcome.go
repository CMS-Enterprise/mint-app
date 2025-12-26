package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionPOCWelcomeTemplateName is the template name for the POC welcome email
const MTOCommonSolutionPOCWelcomeTemplateName = "mto_common_solution_poc_welcome"

//go:embed templates/mto_common_solution_poc_welcome_subject.html
var MTOCommonSolutionPOCWelcomeSubjectTemplate string

//go:embed templates/mto_common_solution_poc_welcome_body.html
var MTOCommonSolutionPOCWelcomeBodyTemplate string

// MTOCommonSolutionPOCWelcomeSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionPOCWelcomeSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// MTOCommonSolutionPOCWelcomeBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionPOCWelcomeBodyContent struct {
	ClientAddress         string
	Key                   string
	SolutionAcronym       string
	SolutionName          string
	IsPrimary             string // "Yes" or "No"
	ReceivesNotifications string // "Yes" or "No"
}

// NewMTOCommonSolutionPOCWelcomeBodyContent constructs the email body content when a user is added as a point of contact.
func NewMTOCommonSolutionPOCWelcomeBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
	solutionName string,
) MTOCommonSolutionPOCWelcomeBodyContent {
	return MTOCommonSolutionPOCWelcomeBodyContent{
		ClientAddress:         clientAddress,
		Key:                   string(contact.Key),
		SolutionAcronym:       string(contact.Key),
		SolutionName:          solutionName,
		IsPrimary:             boolToYesNo(contact.IsPrimary),
		ReceivesNotifications: boolToYesNo(contact.ReceiveEmails),
	}
}
