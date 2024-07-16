package notifications

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityDataExchangeApproachCompletedCreate() {

	// we are just choosing a valid UUID to set for the entityID
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID

	approachCreator, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	approachMarkedCompleteBy, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "MINT")
	suite.NoError(err)

	receivers := []*models.UserAccountAndNotificationPreferences{
		{
			UserAccount:     *approachCreator.UserAccount,
			PreferenceFlags: models.DefaultUserNotificationPreferencesFlags(),
		},
	}

	approach := models.NewDataExchangeApproach(
		"TestDataExchangeApproach",
		actorID,
		modelPlanID,
	)

	testActivity, err := ActivityDataExchangeApproachCompletedCreate(
		suite.testConfigs.Context,
		actorID,
		suite.testConfigs.Store,
		receivers,
		approach.ID,
		approachMarkedCompleteBy.Account().ID,
	)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityDataExchangeApproachCompleted, testActivity.ActivityType)
	// Assert meta data is not deserialized here
	suite.Nil(testActivity.MetaData)
	//Assert meta data can be deserialized
	suite.NotNil(testActivity.MetaDataRaw)
	meta, err := parseRawActivityMetaData(testActivity.ActivityType, testActivity.MetaDataRaw)
	suite.NoError(err)
	suite.NotNil(meta)

	actorNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.EqualValues(0, actorNots.NumUnreadNotifications())

	creatorNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, approachCreator)
	suite.NoError(err)
	suite.EqualValues(1, creatorNots.NumUnreadNotifications())

}
