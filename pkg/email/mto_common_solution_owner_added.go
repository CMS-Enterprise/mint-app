package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// SystemOwnerAddedSubjectContent defines the parameters necessary for the email subject.
type SystemOwnerAddedSubjectContent struct {
	SolutionAcronym string
}

// SystemOwnerAddedBodyContent defines the parameters necessary for the email body.
type SystemOwnerAddedBodyContent struct {
	ClientAddress   string
	Key             string
	SolutionAcronym string
	OwnerType       string
}

// NewSystemOwnerAddedBodyContent constructs the email body content when a System Owner or Business Owner is added.
func NewSystemOwnerAddedBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
) SystemOwnerAddedBodyContent {
	ownerType := "User"
	if contact.IsTeam {
		ownerType = "Team Mailbox"
	}
	return SystemOwnerAddedBodyContent{
		ClientAddress:   clientAddress,
		Key:             string(contact.Key),
		SolutionAcronym: string(contact.Key),
		OwnerType:       ownerType,
	}
}
