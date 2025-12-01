package emailtemplates

import (
	"bytes"
	"fmt"
	htmlTemplate "html/template"
	"strings"
	textTemplate "text/template"
)

const maxSubjectLength = 255

// sanitizeSubject removes newlines and carriage returns from email subjects
// and caps the length to prevent header injection attacks
func sanitizeSubject(subject string) string {
	// Replace carriage returns and newlines with spaces to prevent header injection
	subject = strings.ReplaceAll(subject, "\r\n", " ")
	subject = strings.ReplaceAll(subject, "\r", " ")
	subject = strings.ReplaceAll(subject, "\n", " ")

	// Trim whitespace
	subject = strings.TrimSpace(subject)

	// Cap length at 255 characters
	if len(subject) > maxSubjectLength {
		subject = subject[:maxSubjectLength]
	}

	return subject
}

// EmailTemplate is a struct to define an email template and generate emails from it
type EmailTemplate struct {
	subjectTemplateName string
	bodyTemplateName    string
	templateCache       *TemplateCache
}

// GenEmailTemplate is a generic struct to define an email template and generate emails from it
// it is type safe for the subject and body content
type GenEmailTemplate[subjectType any, bodyType any] struct {
	Name            string
	SubjectTemplate *textTemplate.Template
	BodyTemplate    *htmlTemplate.Template
}

// NewGenEmailTemplate is a constructor to create a new instance of a generic email template
// It references an embedded template for any shared sub-templates
func NewGenEmailTemplate[subjectType any, bodyType any](
	name string,
	subjectTemplateString string,
	bodyTemplateString string,
	embeddedTemplate *htmlTemplate.Template,
) (*GenEmailTemplate[subjectType, bodyType], error) {
	var bodyTemplate = htmlTemplate.New(name + "_body")
	bodyTemplate.Option("missingkey=error")
	var subjectTemplate = textTemplate.New(name + "_subject")
	subjectTemplate.Option("missingkey=error")
	if embeddedTemplate != nil {
		clonedEmbedded, err := embeddedTemplate.Clone()
		if err != nil {
			return nil, err
		}
		bodyTemplate = clonedEmbedded.New(name + "_body")
	}
	_, err := bodyTemplate.Parse(bodyTemplateString)
	if err != nil {
		return nil, err
	}
	_, err = subjectTemplate.Parse(subjectTemplateString)
	if err != nil {
		return nil, err
	}
	return &GenEmailTemplate[subjectType, bodyType]{
		Name:            name,
		SubjectTemplate: subjectTemplate,
		BodyTemplate:    bodyTemplate,
	}, nil
}

// MustNewGenEmailTemplate is a helper function to create a new instance of a generic email template
// It panics if there is an error during creation
func MustNewGenEmailTemplate[subjectType any, bodyType any](
	name string,
	subjectTemplateString string,
	bodyTemplateString string,
	embeddedTemplate *htmlTemplate.Template,
) *GenEmailTemplate[subjectType, bodyType] {
	tpl, err := NewGenEmailTemplate[subjectType, bodyType](name, subjectTemplateString, bodyTemplateString, embeddedTemplate)
	if err != nil {
		panic(err)
	}
	return tpl
}

// GetContent gets both the subject and body portions of an email template executed with the data provided
func (e *GenEmailTemplate[subjectType, bodyType]) GetContent(subject subjectType, body bodyType) (string, string, error) {
	subjectStr, err := e.GetSubject(subject)
	if err != nil {
		return "", "", fmt.Errorf("failed to get subject for email template %q: %w", e.Name, err)
	}

	bodyStr, err := e.GetBody(body)
	if err != nil {
		return "", "", fmt.Errorf("failed to get body for email template %q: %w", e.Name, err)
	}

	return subjectStr, bodyStr, nil
}

// GetSubject gets the subject portion of an email template executed with the data provided
func (e *GenEmailTemplate[subjectType, bodyType]) GetSubject(subject subjectType) (string, error) {
	var buffer bytes.Buffer
	err := e.SubjectTemplate.Execute(&buffer, subject)
	if err != nil {
		return "", err
	}

	return sanitizeSubject(buffer.String()), nil
}

// GetBody gets the body portion of an email template executed with the data provided
func (e *GenEmailTemplate[subjectType, bodyType]) GetBody(body bodyType) (string, error) {
	var buffer bytes.Buffer
	err := e.BodyTemplate.Execute(&buffer, body)
	if err != nil {
		return "", err
	}

	return buffer.String(), nil
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

	subject, err := e.executeTextTemplate(subjectTemplate, data)
	if err != nil {
		return "", err
	}

	return sanitizeSubject(subject), nil
}

// GetExecutedBody gets the body portion of an email template executed with the data provided
func (e *EmailTemplate) GetExecutedBody(data interface{}) (string, error) {
	bodyTemplate, err := e.templateCache.GetHTMLTemplate(e.bodyTemplateName)
	if err != nil {
		return "", err
	}

	return e.executeHTMLTemplate(bodyTemplate, data)
}
