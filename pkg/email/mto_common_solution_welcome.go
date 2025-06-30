package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// AddedAsPointOfContactSubjectContent defines the parameters necessary for the email subject.
type AddedAsPointOfContactSubjectContent struct {
	SolutionAcronym string
}

// AddedAsPointOfContactBodyContent defines the parameters necessary for the email body.
type AddedAsPointOfContactBodyContent struct {
	ClientAddress         string
	Key                   string
	SolutionAcronym       string
	IsPrimary             string // "Yes" or "No"
	ReceivesNotifications string // "Yes" or "No"
}

// NewAddedAsPointOfContactBodyContent constructs the email body content when a user is added as a point of contact.
func NewAddedAsPointOfContactBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
) AddedAsPointOfContactBodyContent {
	return AddedAsPointOfContactBodyContent{
		ClientAddress:         clientAddress,
		Key:                   string(contact.Key),
		SolutionAcronym:       string(contact.Key),
		IsPrimary:             boolToYesNo(contact.IsPrimary),
		ReceivesNotifications: boolToYesNo(contact.ReceiveEmails),
	}
}
