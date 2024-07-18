package emailtemplates

import (
	"fmt"
	htmlTemplate "html/template"
	textTemplate "text/template"

	"github.com/go-openapi/errors"
)

// TemplateCache stores a set of constructed htmlTemplate object models
type TemplateCache struct {
	htmlTemplateCache map[string]*htmlTemplate.Template
	textTemplateCache map[string]*textTemplate.Template
}

// NewTemplateCache creates a new TemplateCache instance
func NewTemplateCache() *TemplateCache {
	return &TemplateCache{
		htmlTemplateCache: make(map[string]*htmlTemplate.Template),
		textTemplateCache: make(map[string]*textTemplate.Template),
	}
}

// GetHTMLTemplate returns an instance of a cached htmlTemplate by name
func (t *TemplateCache) GetHTMLTemplate(templateName string) (*htmlTemplate.Template, error) {
	tpl, found := t.htmlTemplateCache[templateName]

	if !found {
		return nil, errors.NotFound("html template not found", templateName)
	}

	return tpl, nil
}

// GetTextTemplate returns an instance of a cached textTemplate by name
func (t *TemplateCache) GetTextTemplate(templateName string) (*textTemplate.Template, error) {
	tpl, found := t.textTemplateCache[templateName]

	if !found {
		return nil, errors.NotFound("text template not found", templateName)
	}

	return tpl, nil
}

// LoadHTMLTemplateFromString parses a string into an object model and stores it in the htmlTemplateCache
func (t *TemplateCache) LoadHTMLTemplateFromString(
	templateName string,
	raw string,
	embeddedTemplates map[string]string, // name to content mapping for embedded templates
) error {
	_, templateExists := t.htmlTemplateCache[templateName]
	if templateExists {
		return fmt.Errorf("htmlTemplate [%s] already exists in htmlTemplateCache", templateName)
	}

	// Create a new template with the specified name
	tpl := htmlTemplate.New(templateName)

	// Parse all the shared/embedded templates first
	for name, content := range embeddedTemplates {
		_, err := tpl.New(name).Parse(content) // Add the shared template under its name
		if err != nil {
			return err
		}
	}

	// Parse the main template (which may reference shared templates)
	_, err := tpl.Parse(raw)
	if err != nil {
		return err
	}

	// Cache the parsed template
	t.htmlTemplateCache[templateName] = tpl
	return nil
}

// LoadTextTemplateFromString parses a string into an object model and stores it in the textTemplateCache
func (t *TemplateCache) LoadTextTemplateFromString(templateName string, raw string) error {
	_, templateExists := t.textTemplateCache[templateName]
	if templateExists {
		return fmt.Errorf("htmlTemplate [%s] already exists in textTemplateCache", templateName)
	}

	tpl, err := textTemplate.New(templateName).Parse(raw)
	if err != nil {
		return err
	}

	t.textTemplateCache[templateName] = tpl
	return nil
}
