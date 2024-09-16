package notifications

import (
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"

	"github.com/stretchr/testify/suite"

	"github.com/cms-enterprise/mint-app/pkg/testconfig"
	useraccounthelperstestconfigs "github.com/cms-enterprise/mint-app/pkg/testconfig/useraccountstoretestconfigs"
)

// ResolverSuite is the testify suite for the resolver package
type NotificationsSuite struct {
	suite.Suite
	testConfigs *testconfig.Base
}

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

// deserializeActivityMetadata is a helper function to deserialize the metadata of an activity
// It asserts that the metadata is not deserialized, and that the raw metadata is deserialized
// This method is used to test the deserialization of the metadata of an activity in notification unit tests
func (suite *NotificationsSuite) deserializeActivityMetadata(testActivity *models.Activity) models.ActivityMetaData {
	suite.Nil(testActivity.MetaData)       // Assert meta data is not deserialized here
	suite.NotNil(testActivity.MetaDataRaw) // Assert meta data can be deserialized

	meta, err := parseRawActivityMetaData(testActivity.ActivityType, testActivity.MetaDataRaw)
	suite.NoError(err)
	suite.NotNil(meta)

	return meta
}
