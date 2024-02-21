package notifications

import (
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/cmsgov/mint-app/pkg/testconfig"
	useraccounthelperstestconfigs "github.com/cmsgov/mint-app/pkg/testconfig/useraccountstoretestconfigs"
)

// ResolverSuite is the testify suite for the resolver package
type NotificationsSuite struct {
	suite.Suite
	testConfigs *testconfig.Base
}

// type NotificationTestConfig struct {
// 	*testconfig.TestConfigBase
// }

// SetupTest clears the database between each test
func (suite *NotificationsSuite) SetupTest() {
	err := suite.testConfigs.GenericSetupTests()
	suite.NoError(err)
}

func TestNotificationsSuite(t *testing.T) {
	rs := new(NotificationsSuite)
	rs.testConfigs = testconfig.GetDefaultTestConfigs(useraccounthelperstestconfigs.GetTestPrincipal)

	suite.Run(t, rs)
}
