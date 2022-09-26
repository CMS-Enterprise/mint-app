package emailTemplates

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewTemplateCache(t *testing.T) {
	cache := NewTemplateCache()

	err := cache.LoadTemplateFromString(
		"testEmail",
		`<html><head>Test Email</head><body>This is a test email.</body></html>"`)
	assert.NoError(t, err)

	err = cache.LoadTemplateFromString(
		"testEmail2",
		`<html><head>Test Email 2</head><body>This is a test email 2.</body></html>"`)
	assert.NoError(t, err)

	_, err = cache.Get("testEmail")
	assert.NoError(t, err)

	_, err = cache.Get("testEmail2")
	assert.NoError(t, err)
}
