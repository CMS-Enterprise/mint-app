package email

import "github.com/cmsgov/mint-app/pkg/shared/emailTemplates"

// TemplateService is the interface layer for template services
type TemplateService interface {
	Load() error
	GetEmailTemplate(emailTemplateName string) (*emailTemplates.EmailTemplate, error)
}
