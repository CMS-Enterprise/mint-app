package appconfig

import (
	"fmt"
	"sync"
)

var (
	once   sync.Once
	appEnv Environment = localEnv
)

// SetEnvironment sets the application environment. This can only be called once.
// Subsequent calls are silently ignored.
func SetEnvironment(env Environment) {
	once.Do(func() {
		appEnv = env
	})
}

// GetEnvironment returns the application environment.
func GetEnvironment() Environment {
	return appEnv
}

// ResetEnvironmentForTesting resets the environment to allow retesting.
// This should only be called in tests.
func ResetEnvironmentForTesting(env Environment) {
	once = sync.Once{}
	SetEnvironment(env)
}

// NewEnvironment returns an environment from a string
func NewEnvironment(config string) (Environment, error) {
	switch config {
	case localEnv.String():
		return localEnv, nil
	case testingEnv.String():
		return testingEnv, nil
	case testEnv.String():
		return testEnv, nil
	case devEnv.String():
		return devEnv, nil
	case implEnv.String():
		return implEnv, nil
	case prodEnv.String():
		return prodEnv, nil
	default:
		return "", fmt.Errorf("unknown environment: %s", config)
	}
}

// EnvironmentKey is used to access the environment from a config
const EnvironmentKey = "APP_ENV"

// Environment represents an environment
type Environment string

const (
	// localEnv is the local environment
	localEnv Environment = "local"
	// testingEnv is the environment for running tests
	testingEnv Environment = "testing"
	// testEnv is the environment for the test deployed env
	testEnv Environment = "test"
	// devEnv is the environment for the dev deployed env
	devEnv Environment = "dev"
	// implEnv is the environment for the impl deployed env
	implEnv Environment = "impl"
	// prodEnv is the environment for the prod deployed env
	prodEnv Environment = "prod"
)

// String gets the environment as a string
func (e Environment) String() string {
	switch e {
	case localEnv:
		return "local"
	case testingEnv:
		return "testing"
	case testEnv:
		return "test"
	case devEnv:
		return "dev"
	case implEnv:
		return "impl"
	case prodEnv:
		return "prod"
	default:
		return ""
	}
}

// Local returns true if the environment is local
func (e Environment) Local() bool {
	return e == localEnv
}

// Testing returns true if the environment is testing
func (e Environment) Testing() bool {
	return e == testingEnv
}

// Test returns true if the environment is test
func (e Environment) Test() bool {
	return e == testEnv
}

// Dev returns true if the environment is dev
func (e Environment) Dev() bool {
	return e == devEnv
}

// Impl returns true if the environment is impl
func (e Environment) Impl() bool {
	return e == implEnv
}

// Prod returns true if the environment is prod
func (e Environment) Prod() bool {
	return e == prodEnv
}

// IsLowerLevelEnvironment returns true if the environment is dev, impl, or test
func (e Environment) IsLowerLevelEnvironment() bool {
	return e == implEnv || e == testEnv || e == devEnv
}

// Deployed returns true if in a deployed environment
func (e Environment) Deployed() bool {
	switch e {
	case devEnv:
		return true
	case testEnv:
		return true
	case implEnv:
		return true
	case prodEnv:
		return true
	default:
		return false
	}
}
