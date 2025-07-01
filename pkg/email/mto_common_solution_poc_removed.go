package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// PointOfContactRemovedSubjectContent defines the parameters necessary for the email subject.
type PointOfContactRemovedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// PointOfContactRemovedBodyContent defines the parameters necessary for the email body.
type PointOfContactRemovedBodyContent struct {
	ClientAddress      string
	Key                string
	SolutionAcronym    string
	SolutionName       string
	RemovedContactType string
	RemovedContactName string
}

// NewPointOfContactRemovedBodyContent constructs the email body content for a point of contact removal.
func NewPointOfContactRemovedBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
	solutionName string,
) PointOfContactRemovedBodyContent {
	RemovedContactType := "Point of Contact"
	if contact.IsPrimary {
		RemovedContactType = "System Owner"
	} else if contact.IsTeam {
		RemovedContactType = "Team Mailbox"
	}

	return PointOfContactRemovedBodyContent{
		ClientAddress:      clientAddress,
		Key:                string(contact.Key),
		SolutionAcronym:    string(contact.Key),
		SolutionName:       solutionName,
		RemovedContactType: RemovedContactType,
		RemovedContactName: contact.Name,
	}
}
