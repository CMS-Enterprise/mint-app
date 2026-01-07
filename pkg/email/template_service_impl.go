package email

import (
	_ "embed"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// TemplateServiceImpl is an implementation-specific structure loading all resources necessary for server execution
type TemplateServiceImpl struct {
	templateCache  *emailtemplates.TemplateCache
	emailTemplates map[string]*emailtemplates.EmailTemplate
	environment    appconfig.Environment
}

// NewTemplateServiceImpl is a constructor for TemplateServiceImpl
func NewTemplateServiceImpl(environment appconfig.Environment) (*TemplateServiceImpl, error) {
	service := &TemplateServiceImpl{
		templateCache: emailtemplates.NewTemplateCache(),
		environment:   environment,
	}

	err := service.Load()
	if err != nil {
		return nil, err
	}

	return service, nil
}

//TODO consider refactoring this so that templates don't need to be loaded with the load method, but instead instantiated as package vars

// Load caches all email templates which will be used by the template service
func (t *TemplateServiceImpl) Load() error {
	t.emailTemplates = make(map[string]*emailtemplates.EmailTemplate)

	return nil
}

// GetEmailTemplate fetches an emailtemplates.EmailTemplate by name from the emailtemplates.TemplateCache
func (t *TemplateServiceImpl) GetEmailTemplate(emailTemplateName string) (*emailtemplates.EmailTemplate, error) {
	emailTemplate, emailTemplateExists := t.emailTemplates[emailTemplateName]

	if !emailTemplateExists {
		return nil, fmt.Errorf("email template %s not found", emailTemplateName)
	}

	return emailTemplate, nil
}
