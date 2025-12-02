package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// AddedAsCollaboratorTemplateName is the template name definition for the corresponding email template
const AddedAsCollaboratorTemplateName string = "added_as_collaborator"

//go:embed templates/added_as_collaborator_subject.html
var addedAsCollaboratorSubjectTemplate string

//go:embed templates/added_as_collaborator_body.html
var addedAsCollaboratorBodyTemplate string

// var AddedAsCollaboratorEmailTemplate *emailtemplates.EmailTemplate = mustLoadEmailTemplate(SharedEmailService, AddedAsCollaboratorTemplateName, addedAsCollaboratorSubjectTemplate, addedAsCollaboratorBodyTemplate)

type collabEmails struct {
	// The email to be sent when a user is added as a collaborator on a model plan
	Added *emailtemplates.GenEmailTemplate[AddedAsCollaboratorSubjectContent, AddedAsCollaboratorBodyContent]
}

var Collaborator = collabEmails{
	Added: NewEmailTemplate[AddedAsCollaboratorSubjectContent, AddedAsCollaboratorBodyContent](
		AddedAsCollaboratorTemplateName,
		addedAsCollaboratorSubjectTemplate,
		addedAsCollaboratorBodyTemplate,
	),
}

// AddedAsCollaboratorSubjectContent defines the parameters necessary for the corresponding email subject
type AddedAsCollaboratorSubjectContent struct {
	ModelName string
}

// AddedAsCollaboratorBodyContent defines the parameters necessary for the corresponding email body
type AddedAsCollaboratorBodyContent struct {
	ClientAddress string
	ModelName     string
	ModelID       string
}
