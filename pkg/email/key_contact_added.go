package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// KeyContactWelcomeTemplateName is the template name for the subject matter experts welcome email
const KeyContactWelcomeTemplateName = "key_contact_welcome"

//go:embed templates/key_contact_welcome_body.html
var KeyContactWelcomeBodyTemplate string

//go:embed templates/key_contact_welcome_subject.html
var KeyContactWelcomeSubjectTemplate string

type keyContactEmail struct {
	// The email to be sent when a user or team email is added as subject matter expert
	Added *emailtemplates.GenEmailTemplate[KeyContactAddedSubjectContent, KeyContactAddedBodyContent]
}

var KeyContact = keyContactEmail{
	Added: NewEmailTemplate[KeyContactAddedSubjectContent, KeyContactAddedBodyContent](
		KeyContactWelcomeTemplateName,
		KeyContactWelcomeSubjectTemplate,
		KeyContactWelcomeBodyTemplate,
	),
}

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
		CategoryName:  category.Name,
	}
}
