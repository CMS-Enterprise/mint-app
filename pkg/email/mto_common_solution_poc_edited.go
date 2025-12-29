package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionPOCEditedTemplateName is the template name for the POC edited email
const MTOCommonSolutionPOCEditedTemplateName = "mto_common_solution_poc_edited"

//go:embed templates/mto_common_solution_poc_edited_subject.html
var MTOCommonSolutionPOCEditedSubjectTemplate string

//go:embed templates/mto_common_solution_poc_edited_body.html
var MTOCommonSolutionPOCEditedBodyTemplate string

// MTOCommonSolutionPOCEditedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionPOCEditedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// MTOCommonSolutionPOCEditedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionPOCEditedBodyContent struct {
	ClientAddress         string
	Key                   string
	SolutionAcronym       string
	SolutionName          string
	ContactName           string
	ContactEmail          string
	ContactRole           string
	IsPrimary             string // "Yes" or "No"
	ReceivesNotifications string // "Yes" or "No"
}

// NewMTOCommonSolutionPOCEditedBodyContent constructs the email body content for a point of contact edit.
func NewMTOCommonSolutionPOCEditedBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
	solutionName string,
) MTOCommonSolutionPOCEditedBodyContent {
	return MTOCommonSolutionPOCEditedBodyContent{
		ClientAddress:         clientAddress,
		Key:                   string(contact.Key),
		SolutionAcronym:       string(contact.Key),
		SolutionName:          solutionName,
		ContactName:           contact.Name,
		ContactEmail:          contact.Email,
		ContactRole:           valueOrEmpty(contact.Role),
		IsPrimary:             boolToYesNo(contact.IsPrimary),
		ReceivesNotifications: boolToYesNo(contact.ReceiveEmails),
	}
}
