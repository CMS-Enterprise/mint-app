package emailtemplates

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
)

func TestGetSubjectInIMPLEnvironment(t *testing.T) {
	assert := assert.New(t)
	tmpl, err := NewGenEmailTemplate[map[string]string, any](
		"test",
		"Test Subject",
		"<html><body>test</body></html>",
		nil,
	)
	assert.NoError(err)
	environment, err := appconfig.NewEnvironment("impl")
	assert.NoError(err)
	appconfig.ResetEnvironmentForTesting(environment)
	subject, err := tmpl.GetSubject(map[string]string{})
	assert.NoError(err)
	assert.Equal("[IMPL] Test Subject", subject)

}
func TestGetSubjectInTESTEnvironment(t *testing.T) {
	assert := assert.New(t)
	tmpl, err := NewGenEmailTemplate[map[string]string, any](
		"test",
		"Test Subject",
		"<html><body>test</body></html>",
		nil,
	)
	assert.NoError(err)
	environment, err := appconfig.NewEnvironment("test")
	assert.NoError(err)
	appconfig.ResetEnvironmentForTesting(environment)
	subject, err := tmpl.GetSubject(map[string]string{})
	assert.NoError(err)
	assert.Equal("[TEST] Test Subject", subject)

}
func TestGetSubjectInPRODEnvironment(t *testing.T) {
	assert := assert.New(t)
	tmpl, err := NewGenEmailTemplate[map[string]string, any](
		"test",
		"Test Subject",
		"<html><body>test</body></html>",
		nil,
	)
	assert.NoError(err)
	environment, err := appconfig.NewEnvironment("prod")
	assert.NoError(err)
	appconfig.ResetEnvironmentForTesting(environment)
	subject, err := tmpl.GetSubject(map[string]string{})
	assert.NoError(err)
	// We don't expect a prefix in prod
	assert.Equal("Test Subject", subject)

}

func TestSanitizeSubject(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "removes newlines",
			input:    "Hello\nWorld",
			expected: "Hello World",
		},
		{
			name:     "removes carriage returns",
			input:    "Hello\rWorld",
			expected: "Hello World",
		},
		{
			name:     "removes both newlines and carriage returns",
			input:    "Hello\r\nWorld\nTest",
			expected: "Hello World Test",
		},
		{
			name:     "trims leading and trailing whitespace",
			input:    "  Hello World  ",
			expected: "Hello World",
		},
		{
			name:     "caps length at 255 characters",
			input:    "a" + string(make([]byte, 300)),
			expected: "a" + string(make([]byte, 254)),
		},
		{
			name:     "handles empty string",
			input:    "",
			expected: "",
		},
		{
			name:     "handles whitespace only",
			input:    "   \n\r\t   ",
			expected: "",
		},
		{
			name:     "preserves normal subject lines",
			input:    "Your order #12345 has been shipped",
			expected: "Your order #12345 has been shipped",
		},
		{
			name:     "handles header injection attempt",
			input:    "Subject Line\r\nBcc: attacker@evil.com",
			expected: "Subject Line Bcc: attacker@evil.com",
		},
		{
			name:     "handles multiple consecutive newlines",
			input:    "Hello\n\n\nWorld",
			expected: "Hello   World",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := sanitizeSubject(tt.input)
			assert.Equal(t, tt.expected, result)
			// Verify no newlines or carriage returns in result
			assert.NotContains(t, result, "\n")
			assert.NotContains(t, result, "\r")
			// Verify length constraint
			assert.LessOrEqual(t, len(result), maxSubjectLength)
		})
	}
}

func TestGenEmailTemplate_GetSubject_Sanitization(t *testing.T) {
	tests := []struct {
		name           string
		subjectTmpl    string
		subjectData    map[string]string
		expectedOutput string
	}{
		{
			name:           "sanitizes subject with newlines from template data",
			subjectTmpl:    "Hello {{.Name}}",
			subjectData:    map[string]string{"Name": "World\nHacker"},
			expectedOutput: "Hello World Hacker",
		},
		{
			name:           "sanitizes subject with carriage returns",
			subjectTmpl:    "Order {{.OrderID}} confirmation",
			subjectData:    map[string]string{"OrderID": "123\r\nBcc: evil@example.com"},
			expectedOutput: "Order 123 Bcc: evil@example.com confirmation",
		},
		{
			name:           "trims whitespace from result",
			subjectTmpl:    "  {{.Subject}}  ",
			subjectData:    map[string]string{"Subject": "Test"},
			expectedOutput: "Test",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmpl, err := NewGenEmailTemplate[map[string]string, any](
				"test",
				tt.subjectTmpl,
				"<html><body>test</body></html>",
				nil,
			)
			assert.NoError(t, err)

			subject, err := tmpl.GetSubject(tt.subjectData)
			assert.NoError(t, err)
			assert.Equal(t, tt.expectedOutput, subject)
			assert.NotContains(t, subject, "\n")
			assert.NotContains(t, subject, "\r")
		})
	}
}

func TestEmailTemplate_GetExecutedSubject_Sanitization(t *testing.T) {
	cache := NewTemplateCache()

	// Load a test subject template
	err := cache.LoadTextTemplateFromString("testSubject", "Hello {{.Name}}")
	assert.NoError(t, err)

	emailTemplate := NewEmailTemplate(cache, "testSubject", "testBody")

	tests := []struct {
		name           string
		data           map[string]string
		expectedOutput string
	}{
		{
			name:           "sanitizes subject with newlines",
			data:           map[string]string{"Name": "World\nTest"},
			expectedOutput: "Hello World Test",
		},
		{
			name:           "sanitizes subject with carriage returns",
			data:           map[string]string{"Name": "World\rTest"},
			expectedOutput: "Hello World Test",
		},
		{
			name:           "handles normal input",
			data:           map[string]string{"Name": "World"},
			expectedOutput: "Hello World",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			subject, err := emailTemplate.GetExecutedSubject(tt.data)
			assert.NoError(t, err)
			assert.Equal(t, tt.expectedOutput, subject)
			assert.NotContains(t, subject, "\n")
			assert.NotContains(t, subject, "\r")
		})
	}
}
