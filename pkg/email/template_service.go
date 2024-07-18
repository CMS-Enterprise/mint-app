package email

import "github.com/cmsgov/mint-app/pkg/shared/emailtemplates"

// TemplateService is the interface layer for template services
type TemplateService interface {
	Load() error
	GetEmailTemplate(emailTemplateName string) (*emailtemplates.EmailTemplate, error)
}
