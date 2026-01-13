package appconfig

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestNewEnvironment tests creating environments from strings
func TestNewEnvironment(t *testing.T) {
	assert := assert.New(t)

	env, err := NewEnvironment("local")
	assert.NoError(err)
	assert.Equal(localEnv, env)

	env, err = NewEnvironment("testing")
	assert.NoError(err)
	assert.Equal(testingEnv, env)

	env, err = NewEnvironment("test")
	assert.NoError(err)
	assert.Equal(testEnv, env)

	env, err = NewEnvironment("dev")
	assert.NoError(err)
	assert.Equal(devEnv, env)

	env, err = NewEnvironment("impl")
	assert.NoError(err)
	assert.Equal(implEnv, env)

	env, err = NewEnvironment("prod")
	assert.NoError(err)
	assert.Equal(prodEnv, env)

	_, err = NewEnvironment("invalid")
	assert.Error(err)
}

// TestPrefixLLESubject tests the environment prefix behavior for lower-level environments.
func TestPrefixLLESubject(t *testing.T) {
	assert := assert.New(t)

	tests := []struct {
		name     string
		env      Environment
		subject  string
		expected string
	}{
		{
			name:     "prefixes with [TEST] for test environment",
			env:      testEnv,
			subject:  "Test Subject",
			expected: "[TEST] Test Subject",
		},
		{
			name:     "prefixes with [IMPL] for impl environment",
			env:      implEnv,
			subject:  "Test Subject",
			expected: "[IMPL] Test Subject",
		},
		{
			name:     "prefixes with [DEV] for dev environment",
			env:      devEnv,
			subject:  "Test Subject",
			expected: "[DEV] Test Subject",
		},
		{
			name:     "does not prefix for prod environment",
			env:      prodEnv,
			subject:  "Test Subject",
			expected: "Test Subject",
		},
		{
			name:     "does not prefix for local environment",
			env:      localEnv,
			subject:  "Test Subject",
			expected: "Test Subject",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.env.PrefixLLESubject(tt.subject)
			assert.Equal(tt.expected, result)
		})
	}
}
