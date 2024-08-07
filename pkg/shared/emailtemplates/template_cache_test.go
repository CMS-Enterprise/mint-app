package emailtemplates

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewTemplateCache(t *testing.T) {
	cache := NewTemplateCache()

	err := cache.LoadHTMLTemplateFromString(
		"testEmail",
		`<html><head>Test Email</head><body>This is a test email.</body></html>"`,
		nil)
	assert.NoError(t, err)

	err = cache.LoadHTMLTemplateFromString(
		"testEmail2",
		`<html><head>Test Email 2</head><body>This is a test email 2.</body></html>"`,
		nil)
	assert.NoError(t, err)

	_, err = cache.GetHTMLTemplate("testEmail")
	assert.NoError(t, err)

	_, err = cache.GetHTMLTemplate("testEmail2")
	assert.NoError(t, err)
}
