package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// SystemOwnerUpdatedSubjectContent defines the parameters necessary for the email subject.
type SystemOwnerUpdatedSubjectContent struct {
	SolutionAcronym string
}

// SystemOwnerUpdatedBodyContent defines the parameters necessary for the email body.
type SystemOwnerUpdatedBodyContent struct {
	ClientAddress   string
	Key             string
	SolutionAcronym string
}

// NewSystemOwnerUpdatedBodyContent constructs the email body content when CMS component ownership is updated.
func NewSystemOwnerUpdatedBodyContent(
	clientAddress string,
	contact models.MTOCommonSolutionContact,
) SystemOwnerUpdatedBodyContent {
	return SystemOwnerUpdatedBodyContent{
		ClientAddress:   clientAddress,
		Key:             string(contact.Key),
		SolutionAcronym: string(contact.Key),
	}
}
