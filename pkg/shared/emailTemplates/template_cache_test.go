package emailTemplates

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewTemplateCache(t *testing.T) {
	cache := NewTemplateCache()

	_, err := cache.Get("testEmail")
	assert.NoError(t, err)

	_, err = cache.Get("testEmail2")
	assert.NoError(t, err)
}
