package notifications

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityModelFollowerUpdateCreate() {
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	content := "<p>Hello followers</p>"

	receiverPrincipal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	receivers := []*models.UserAccountAndNotificationPreferences{
		{
			UserAccount:     *receiverPrincipal.UserAccount,
			PreferenceFlags: models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		},
	}

	testActivity, err := ActivityModelFollowerUpdateCreate(
		suite.testConfigs.Context,
		actorID,
		suite.testConfigs.Store,
		receivers,
		modelPlanID,
		content,
	)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityModelFollowerUpdate, testActivity.ActivityType)
	suite.EqualValues(modelPlanID, testActivity.EntityID)
	suite.Nil(testActivity.MetaData)
	suite.NotNil(testActivity.MetaDataRaw)

	err = testActivity.ParseRawActivityMetaData()
	suite.NoError(err)
	suite.NotNil(testActivity.MetaData)

	meta := testActivity.MetaData.(*models.ModelFollowerUpdateActivityMeta)
	suite.EqualValues(modelPlanID, meta.ModelPlanID)
	suite.Equal(content, meta.Content)

	actorNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.EqualValues(0, actorNots.NumUnreadNotifications())

	receiverNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, receiverPrincipal)
	suite.NoError(err)
	suite.EqualValues(1, receiverNots.NumUnreadNotifications())
}
