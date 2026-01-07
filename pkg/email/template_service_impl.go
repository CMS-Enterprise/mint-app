package email

import (
	_ "embed"
	"fmt"
	"strings"

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

func (t *TemplateServiceImpl) loadEmailTemplate(emailTemplateName string, subjectTemplate string, bodyTemplate string) error {
	_, emailTemplateExists := t.emailTemplates[emailTemplateName]
	if emailTemplateExists {
		return fmt.Errorf("email template %s already exists", emailTemplateName)
	}

	subjectEmailTemplateName := emailTemplateName + "_subject"
	bodyEmailTemplateName := emailTemplateName + "_body"

	// Add environment prefix to subject if in dev, or impl
	if t.environment.Dev() || t.environment.Impl() {
		envName := strings.ToUpper(t.environment.String())
		subjectTemplate = fmt.Sprintf("[%s] %s", envName, subjectTemplate)
	}

	err := t.templateCache.LoadTextTemplateFromString(subjectEmailTemplateName, subjectTemplate)
	if err != nil {
		return err
	}

	err = t.templateCache.LoadHTMLTemplateFromString(bodyEmailTemplateName, bodyTemplate, predefinedTemplates)
	if err != nil {
		return err
	}

	t.emailTemplates[emailTemplateName] = emailtemplates.NewEmailTemplate(t.templateCache, subjectEmailTemplateName, bodyEmailTemplateName)

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
