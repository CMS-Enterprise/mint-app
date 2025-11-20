package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// KeyContactAddedSubjectContent defines the parameters necessary for the email subject.
type KeyContactAddedSubjectContent struct {
	IsTeam bool
}

// KeyContactAddedBodyContent defines the parameters necessary for the email body.
type KeyContactAddedBodyContent struct {
	ClientAddress     string
	ContactName       string
	IsTeam            bool
	SubjectCategoryID string
	SubjectArea       string
}

// NewKeyContactAddedBodyContent constructs an email body content struct from an KeyContact.
func NewKeyContactAddedBodyContent(
	clientAddress string,
	contact models.KeyContact,
) KeyContactAddedBodyContent {
	return KeyContactAddedBodyContent{
		ClientAddress:     clientAddress,
		ContactName:       contact.Name,
		IsTeam:            contact.IsTeam,
		SubjectArea:       string(contact.SubjectArea),
		SubjectCategoryID: contact.SubjectCategoryID.String(),
	}
}
