package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// PointOfContactAddedSubjectContent defines the parameters necessary for the email subject.
type PointOfContactAddedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// PointOfContactAddedBodyContent defines the parameters necessary for the email body.
type PointOfContactAddedBodyContent struct {
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

// NewPointOfContactAddedBodyContent constructs an email body content struct from an MTOCommonSolutionContact.
func NewPointOfContactAddedBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
	solutionName string,
) PointOfContactAddedBodyContent {
	return PointOfContactAddedBodyContent{
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
