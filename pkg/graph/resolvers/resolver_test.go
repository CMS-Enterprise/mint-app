package resolvers

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

// ResolverSuite is the testify suite for the resolver package
type ResolverSuite struct {
	suite.Suite
}

// SetupTest clears the database between each test
func (suite *ResolverSuite) SetupTest() {
	tc := GetDefaultTestConfigs()
	err := tc.Store.TruncateAllTablesDANGEROUS(tc.Logger)
	assert.NoError(suite.T(), err)
}

// TestResolverSuite runs the resolver test suite
func TestResolverSuite(t *testing.T) {
	suite.Run(t, new(ResolverSuite))
}
