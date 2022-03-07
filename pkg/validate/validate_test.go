package validate

import (
	"testing"

	"github.com/stretchr/testify/suite"
)

type ValidateTestSuite struct {
	suite.Suite
}

func TestValidateTestSuite(t *testing.T) {
	testSuite := &ValidateTestSuite{
		Suite: suite.Suite{},
	}

	if !testing.Short() {
		suite.Run(t, testSuite)
	}
}
