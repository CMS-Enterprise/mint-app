package emailtemplates

import (
	"bytes"
	htmlTemplate "html/template"
	textTemplate "text/template"
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

func (e *EmailTemplate) executeHTMLTemplate(tpl *htmlTemplate.Template, data interface{}) (string, error) {
	var buffer bytes.Buffer
	err := tpl.Execute(&buffer, data)
	if err != nil {
		return "", err
	}

	return buffer.String(), nil
}

func (e *EmailTemplate) executeTextTemplate(tpl *textTemplate.Template, data interface{}) (string, error) {
	var buffer bytes.Buffer
	err := tpl.Execute(&buffer, data)
	if err != nil {
		return "", err
	}

	return buffer.String(), nil
}

// GetExecutedSubject gets the subject portion of an email template executed with the data provided
func (e *EmailTemplate) GetExecutedSubject(data interface{}) (string, error) {
	subjectTemplate, err := e.templateCache.GetTextTemplate(e.subjectTemplateName)
	if err != nil {
		return "", err
	}

	return e.executeTextTemplate(subjectTemplate, data)
}

// GetExecutedBody gets the body portion of an email template executed with the data provided
func (e *EmailTemplate) GetExecutedBody(data interface{}) (string, error) {
	bodyTemplate, err := e.templateCache.GetHTMLTemplate(e.bodyTemplateName)
	if err != nil {
		return "", err
	}

	return e.executeHTMLTemplate(bodyTemplate, data)
}
