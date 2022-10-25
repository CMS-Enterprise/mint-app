package emailTemplates

import (
	"fmt"
	"html/template"

	"github.com/go-openapi/errors"
)

// TemplateCache stores a set of constructed template object models
type TemplateCache struct {
	cache map[string]*template.Template
}

// NewTemplateCache creates a new TemplateCache instance
func NewTemplateCache() *TemplateCache {
	templateCache := make(map[string]*template.Template)
	return &TemplateCache{cache: templateCache}
}

// Get returns an instance of a cached template by name
func (t *TemplateCache) Get(templateName string) (*template.Template, error) {
	tpl, found := t.cache[templateName]

	if !found {
		return nil, errors.NotFound("Template not found", templateName)
	}

	return tpl, nil
}

// LoadTemplateFromString parses a string into an object model and stores it in the cache
func (t *TemplateCache) LoadTemplateFromString(templateName string, raw string) error {
	_, templateExists := t.cache[templateName]
	if templateExists {
		return fmt.Errorf("template [%s] already exists in cache", templateName)
	}

	tpl, err := template.New(templateName).Parse(raw)
	if err != nil {
		return err
	}

	t.cache[templateName] = tpl
	return nil
}
