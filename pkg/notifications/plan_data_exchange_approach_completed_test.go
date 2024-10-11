package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityDataExchangeApproachCompletedCreate() {

	// we are just choosing a valid UUID to set for the entityID
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID

	mockPreferencesLoader := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		// Return mock data, all notifications enabled
		return models.NewUserNotificationPreferences(user_id), nil
	}

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

	approach := models.NewPlanDataExchangeApproach(
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
		mockPreferencesLoader,
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
