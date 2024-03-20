package notifications

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityModelPlanShareCreate() {
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	testPreferences := models.NewUserNotificationPreferences(actorID)
	testMessage := "This is a test message"

	// Create an activity
	testActivity, err := ActivityModelPlanSharedCreate(suite.testConfigs.Context, suite.testConfigs.Store, actorID, modelPlanID, &testMessage, testPreferences)

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

	actorNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.EqualValues(1, actorNots.NumUnreadNotifications())

	// Assert that the deserialized model plan id is the same as the one we created the activity with
	suite.EqualValues(modelPlanID, meta.(*models.ModelPlanSharedActivityMeta).ModelPlanID)
	suite.NotNil(meta.(*models.ModelPlanSharedActivityMeta).OptionalMessage)
	suite.EqualValues(testMessage, *meta.(*models.ModelPlanSharedActivityMeta).OptionalMessage)
}
