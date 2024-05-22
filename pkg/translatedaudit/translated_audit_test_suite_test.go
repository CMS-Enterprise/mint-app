package translatedaudit

import (
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/cmsgov/mint-app/pkg/testconfig"
	useraccounthelperstestconfigs "github.com/cmsgov/mint-app/pkg/testconfig/useraccountstoretestconfigs"
)

// TAuditSuite is the testify suite for the translated audit package
type TAuditSuite struct {
	suite.Suite
	testConfigs *testconfig.Base
}

// SetupTest clears the database between each test
func (suite *TAuditSuite) SetupTest() {
	err := suite.testConfigs.GenericSetupTests()
	suite.NoError(err)
}

func TestNotificationsSuite(t *testing.T) {
	auditSuite := new(TAuditSuite)
	auditSuite.testConfigs = testconfig.GetDefaultTestConfigs(useraccounthelperstestconfigs.GetTestPrincipal)

	suite.Run(t, auditSuite)
}
