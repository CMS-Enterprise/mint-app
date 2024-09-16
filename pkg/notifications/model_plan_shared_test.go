package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityModelPlanShareCreate() {
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	testMessage := "This is a test message"

	receiverPrincipal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	mockPreferencesLoader := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		// Return mock data, all notifications enabled
		return models.NewUserNotificationPreferences(user_id), nil
	}

	// Create an activity
	testActivity, err := ActivityModelPlanSharedCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		actorID,
		[]uuid.UUID{receiverPrincipal.Account().ID},
		modelPlanID,
		&testMessage,
		mockPreferencesLoader,
	)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityModelPlanShared, testActivity.ActivityType)

	// Assert meta data is not deserialized here
	suite.Nil(testActivity.MetaData)

	//Assert meta data can be deserialized
	suite.NotNil(testActivity.MetaDataRaw)
	meta, err := parseRawActivityMetaData(testActivity.ActivityType, testActivity.MetaDataRaw)
	suite.NoError(err)
	suite.NotNil(meta)

	actorNots, err := UserNotificationCollectionGetByUser(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		receiverPrincipal,
	)
	suite.NoError(err)
	suite.EqualValues(1, actorNots.NumUnreadNotifications())

	// Assert that the deserialized model plan id is the same as the one we created the activity with
	suite.EqualValues(modelPlanID, meta.(*models.ModelPlanSharedActivityMeta).ModelPlanID)
	suite.NotNil(meta.(*models.ModelPlanSharedActivityMeta).OptionalMessage)
	suite.EqualValues(testMessage, *meta.(*models.ModelPlanSharedActivityMeta).OptionalMessage)
}
