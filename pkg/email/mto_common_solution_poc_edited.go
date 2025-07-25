package email

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// PointOfContactUpdatedSubjectContent defines the parameters necessary for the email subject.
type PointOfContactUpdatedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// PointOfContactUpdatedBodyContent defines the parameters necessary for the email body.
type PointOfContactUpdatedBodyContent struct {
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

// NewPointOfContactUpdatedBodyContent constructs the email body content for a point of contact update.
func NewPointOfContactUpdatedBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
	solutionName string,
) PointOfContactUpdatedBodyContent {
	return PointOfContactUpdatedBodyContent{
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
