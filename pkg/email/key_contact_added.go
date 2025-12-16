package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// KeyContactAddedSubjectContent defines the parameters necessary for the email subject.
type KeyContactAddedSubjectContent struct {
	IsTeam bool
}

// NewKeyContactAddedSubjectContent constructs an email subject content struct from an KeyContact.
func NewKeyContactAddedSubjectContent(
	contact models.KeyContact,
) KeyContactAddedSubjectContent {
	return KeyContactAddedSubjectContent{
		IsTeam: contact.MailboxAddress != nil,
	}
}

// KeyContactAddedBodyContent defines the parameters necessary for the email body.
type KeyContactAddedBodyContent struct {
	ClientAddress string
	ContactName   *string
	IsTeam        bool
	CategoryName  string
	SubjectArea   string
}

// NewKeyContactAddedBodyContent constructs an email body content struct from an KeyContact.
func NewKeyContactAddedBodyContent(
	clientAddress string,
	contact models.KeyContact,
	category models.KeyContactCategory,
) KeyContactAddedBodyContent {
	return KeyContactAddedBodyContent{
		ClientAddress: clientAddress,
		ContactName:   contact.Name,
		IsTeam:        contact.MailboxAddress != nil,
		SubjectArea:   string(contact.SubjectArea),
		CategoryName:  category.Category,
	}
}
