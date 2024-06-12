package notifications

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityDatesChangedCreate() {
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	receiverPrincipal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	timeNow := time.Now()

	testDateChanges := []models.DateChange{
		{
			IsChanged:     false,
			Field:         models.DateChangeFieldTypeApplications,
			IsRange:       false,
			OldDate:       &timeNow,
			NewDate:       nil,
			OldRangeStart: nil,
			OldRangeEnd:   nil,
			NewRangeStart: nil,
			NewRangeEnd:   nil,
		},
	}

	testRecipients := []*models.UserAccountAndNotifPreferences{
		{
			UserAccount:     *receiverPrincipal.Account(),
			PreferenceFlags: models.DefaultUserNotificationPreferencesFlags(),
		},
	}

	// Create an activity
	testActivity, err := ActivityDatesChangedCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		actorID,
		modelPlanID,
		testDateChanges,
		testRecipients,
	)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityDatesChanged, testActivity.ActivityType)

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
	suite.EqualValues(modelPlanID, meta.(*models.DatesChangedActivityMeta).ModelPlanID)
	suite.Len(meta.(*models.DatesChangedActivityMeta).DateChanges, 1)
	suite.EqualValues(testDateChanges[0].IsChanged, meta.(*models.DatesChangedActivityMeta).DateChanges[0].IsChanged)
	suite.EqualValues(testDateChanges[0].Field, meta.(*models.DatesChangedActivityMeta).DateChanges[0].Field)
	suite.EqualValues(testDateChanges[0].IsRange, meta.(*models.DatesChangedActivityMeta).DateChanges[0].IsRange)
	suite.True(meta.(*models.DatesChangedActivityMeta).DateChanges[0].OldDate.Equal(*testDateChanges[0].OldDate))
	suite.Nil(meta.(*models.DatesChangedActivityMeta).DateChanges[0].NewDate)
	suite.Nil(meta.(*models.DatesChangedActivityMeta).DateChanges[0].OldRangeStart)
	suite.Nil(meta.(*models.DatesChangedActivityMeta).DateChanges[0].OldRangeEnd)
	suite.Nil(meta.(*models.DatesChangedActivityMeta).DateChanges[0].NewRangeStart)
	suite.Nil(meta.(*models.DatesChangedActivityMeta).DateChanges[0].NewRangeEnd)
}
