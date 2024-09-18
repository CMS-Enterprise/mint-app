package notifications

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityNewModelPlanCreate() {
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID

	receiverPrincipal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)
	suite.NotNil(receiverPrincipal.Account().Username)

	mockPreferences := []*models.UserAccountAndNotificationPreferences{{
		UserAccount:     *receiverPrincipal.Account(),
		PreferenceFlags: models.DefaultUserNotificationPreferencesFlags(),
	},
	}

	// Create an activity
	testActivity, err := ActivityNewModelPlanCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		actorID,
		modelPlanID,
		mockPreferences,
	)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityNewModelPlan, testActivity.ActivityType)

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
	suite.EqualValues(modelPlanID, meta.(*models.NewModelPlanActivityMeta).ModelPlanID)
}
