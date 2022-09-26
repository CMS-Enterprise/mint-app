package email

import (
	_ "embed"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/shared/emailTemplates"
)

// AddedAsCollaboratorTemplateName is the template name definition for the corresponding email template
const AddedAsCollaboratorTemplateName string = "added_as_collaborator"

//go:embed templates/added_as_collaborator_subject.template
var addedAsCollaboratorSubjectTemplate string

//go:embed templates/added_as_collaborator_body.template
var addedAsCollaboratorBodyTemplate string

// TemplateService is an implementation-specific structure loading all resources necessary for server execution
type TemplateService struct {
	templateCache  *emailTemplates.TemplateCache
	emailTemplates map[string]*emailTemplates.EmailTemplate
}

// NewTemplateService is a constructor for TemplateService
func NewTemplateService() (*TemplateService, error) {
	service := &TemplateService{templateCache: emailTemplates.NewTemplateCache()}

	err := service.Load()
	if err != nil {
		return nil, err
	}

	return service, nil
}

// Load caches all email templates which will be used by the template service
func (t *TemplateService) Load() error {
	t.emailTemplates = make(map[string]*emailTemplates.EmailTemplate)

	err := t.loadEmailTemplate(AddedAsCollaboratorTemplateName, addedAsCollaboratorSubjectTemplate, addedAsCollaboratorBodyTemplate)
	if err != nil {
		return err
	}

	return nil
}

func (t *TemplateService) loadEmailTemplate(emailTemplateName string, subjectTemplate string, bodyTemplate string) error {
	_, emailTemplateExists := t.emailTemplates[emailTemplateName]
	if emailTemplateExists {
		return fmt.Errorf("email template %s already exists", emailTemplateName)
	}

	subjectEmailTemplateName := emailTemplateName + "_subject"
	bodyEmailTemplateName := emailTemplateName + "_body"

	err := t.templateCache.LoadTemplateFromString(subjectEmailTemplateName, subjectTemplate)
	if err != nil {
		return err
	}

	err = t.templateCache.LoadTemplateFromString(bodyEmailTemplateName, bodyTemplate)
	if err != nil {
		return err
	}

	t.emailTemplates[emailTemplateName] = emailTemplates.NewEmailTemplate(t.templateCache, subjectEmailTemplateName, bodyEmailTemplateName)

	return nil
}

// GetEmailTemplate fetches an emailTemplates.EmailTemplate by name from the emailTemplates.TemplateCache
func (t *TemplateService) GetEmailTemplate(emailTemplateName string) (*emailTemplates.EmailTemplate, error) {
	emailTemplate, emailTemplateExists := t.emailTemplates[emailTemplateName]

	if !emailTemplateExists {
		return nil, fmt.Errorf("email template %s not found", emailTemplateName)
	}

	return emailTemplate, nil
}
