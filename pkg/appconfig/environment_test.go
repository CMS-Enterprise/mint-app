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

// TestSetEnvironment tests setting and getting the environment
func TestSetEnvironment(t *testing.T) {
	assert := assert.New(t)

	SetEnvironment(devEnv)
	currentEnv := GetEnvironment()
	assert.Equal(devEnv, currentEnv)

	// You can't change the environment once it's set
	SetEnvironment(prodEnv)
	currentEnv = GetEnvironment()
	// even though we
	assert.Equal(devEnv, currentEnv)

	// This is a utility test function, so we can reset the environment for other tests
	ResetEnvironmentForTesting(prodEnv)
	currentEnv = GetEnvironment()
	// Environment should now be prod
	assert.Equal(prodEnv, currentEnv)

	SetEnvironment(devEnv)
	currentEnv = GetEnvironment()
	// even though we set to dev, it should still be prod
	assert.Equal(prodEnv, currentEnv)

}
