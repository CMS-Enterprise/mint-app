package emailTemplates

import (
	"bytes"
	"html/template"
)

// EmailTemplate is a struct to define an email template and generate emails from it
type EmailTemplate struct {
	subjectTemplateName string
	bodyTemplateName    string
	templateCache       *TemplateCache
}

// NewEmailTemplate is a constructor to create a new instance of an email template
func NewEmailTemplate(
	templateCache *TemplateCache,
	subjectTemplateName string,
	bodyTemplateName string,
) *EmailTemplate {
	return &EmailTemplate{
		templateCache:       templateCache,
		subjectTemplateName: subjectTemplateName,
		bodyTemplateName:    bodyTemplateName,
	}
}

func (e *EmailTemplate) executeTemplate(tpl *template.Template, data interface{}) (string, error) {
	var buffer bytes.Buffer
	err := tpl.Execute(&buffer, data)
	if err != nil {
		return "", err
	}

	return buffer.String(), nil
}

// GetExecutedSubject gets the subject portion of an email template executed with the data provided
func (e *EmailTemplate) GetExecutedSubject(data interface{}) (string, error) {
	subjectTemplate, err := e.templateCache.Get(e.subjectTemplateName)
	if err != nil {
		return "", err
	}

	return e.executeTemplate(subjectTemplate, data)
}

// GetExecutedBody gets the body portion of an email template executed with the data provided
func (e *EmailTemplate) GetExecutedBody(data interface{}) (string, error) {
	bodyTemplate, err := e.templateCache.Get(e.bodyTemplateName)
	if err != nil {
		return "", err
	}

	return e.executeTemplate(bodyTemplate, data)
}
