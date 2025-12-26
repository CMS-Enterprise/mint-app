package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionPOCAddedTemplateName is the template name for the POC added email
const MTOCommonSolutionPOCAddedTemplateName = "mto_common_solution_poc_added"

//go:embed templates/mto_common_solution_poc_added_subject.html
var MTOCommonSolutionPOCAddedSubjectTemplate string

//go:embed templates/mto_common_solution_poc_added_body.html
var MTOCommonSolutionPOCAddedBodyTemplate string

// MTOCommonSolutionPOCAddedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionPOCAddedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// MTOCommonSolutionPOCAddedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionPOCAddedBodyContent struct {
	SolutionAcronym          string
	SolutionName             string
	ContactName              string
	ContactEmail             string
	ContactRole              string
	IsPrimary                string // "Yes" or "No"
	WillReceiveNotifications string // "Yes" or "No"
	ClientAddress            string
	Key                      string
}

// NewMTOCommonSolutionPOCAddedBodyContent constructs an email body content struct from an MTOCommonSolutionContact.
func NewMTOCommonSolutionPOCAddedBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
	solutionName string,
) MTOCommonSolutionPOCAddedBodyContent {
	return MTOCommonSolutionPOCAddedBodyContent{
		ClientAddress:            clientAddress,
		Key:                      string(contact.Key),
		SolutionAcronym:          string(contact.Key),
		SolutionName:             solutionName,
		ContactName:              contact.Name,
		ContactEmail:             contact.Email,
		ContactRole:              valueOrEmpty(contact.Role),
		IsPrimary:                boolToYesNo(contact.IsPrimary),
		WillReceiveNotifications: boolToYesNo(contact.ReceiveEmails),
	}
}
