package notifications

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/testconfig/useraccountstoretestconfigs"
)

func (suite *NotificationsSuite) TestUserNotificationCreate() {

	// we are just choosing a valid UUID to set for the entityID
	modelPlanID := uuid.New()
	discussionID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	testContent := "test content"

	testActivity := models.NewTaggedInPlanDiscussionActivity(actorID, modelPlanID, discussionID, testContent)

	createdActivity, err := activityCreate(suite.testConfigs.Context, suite.testConfigs.Store, testActivity)
	suite.NoError(err)
	suite.NotNil(createdActivity)

	fakePrinc, err := useraccountstoretestconfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	preferenceFlags := models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp}
	notification, err := userNotificationCreate(suite.testConfigs.Context, suite.testConfigs.Store, createdActivity, fakePrinc.Account().ID, preferenceFlags)
	suite.NoError(err)
	suite.NotNil(notification)

	// Assert expected values
	suite.EqualValues(createdActivity.ID, notification.ActivityID)
	suite.EqualValues(notification.UserID, fakePrinc.Account().ID)
	suite.EqualValues(notification.CreatedBy, createdActivity.ActorID)
	suite.EqualValues(notification.EmailSent, false)
	suite.EqualValues(notification.InAppSent, true)
	suite.EqualValues(notification.IsRead, false)

}

func (suite *NotificationsSuite) TestUserNotificationMarkReadFunctions() {

	// we are just choosing a valid UUID to set for the entityID
	modelPlanID := uuid.New()
	discussionID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	testContent := "test content"

	testActivity := models.NewTaggedInPlanDiscussionActivity(actorID, modelPlanID, discussionID, testContent)

	createdActivity, err := activityCreate(suite.testConfigs.Context, suite.testConfigs.Store, testActivity)
	suite.NoError(err)
	suite.NotNil(createdActivity)

	fakePrinc, err := useraccountstoretestconfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	preferenceFlags := models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp}
	notification1, err := userNotificationCreate(suite.testConfigs.Context, suite.testConfigs.Store, createdActivity, fakePrinc.Account().ID, preferenceFlags)
	suite.NoError(err)
	suite.NotNil(notification1)

	notification2, err := userNotificationCreate(suite.testConfigs.Context, suite.testConfigs.Store, createdActivity, fakePrinc.Account().ID, preferenceFlags)
	suite.NoError(err)
	suite.NotNil(notification2)

	notification3, err := userNotificationCreate(suite.testConfigs.Context, suite.testConfigs.Store, createdActivity, fakePrinc.Account().ID, preferenceFlags)
	suite.NoError(err)
	suite.NotNil(notification3)

	suite.Run("Can set one notification as read", func() {

		retNot, err := UserNotificationMarkAsRead(suite.testConfigs.Context, suite.testConfigs.Store, fakePrinc, notification1.ID)
		suite.NoError(err)
		suite.EqualValues(retNot.ID, notification1.ID)
		suite.NotNil(retNot)

		allNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, fakePrinc)
		suite.NoError(err)
		suite.Len(allNots.Notifications, 3)
		readNotification, found := lo.Find(allNots.Notifications, func(notification *models.UserNotification) bool {
			return notification.ID == retNot.ID
		})
		suite.True(found)
		suite.NotNil(readNotification)

		suite.EqualValues(allNots.NumUnreadNotifications(), 2)
		suite.Len(allNots.UnreadNotifications(), allNots.NumUnreadNotifications())

		suite.EqualValues(readNotification.IsRead, true)

	})

	suite.Run("Can set all notification as read", func() {

		readNots, err := UserNotificationMarkAllAsRead(suite.testConfigs.Context, suite.testConfigs.Store, fakePrinc)
		suite.NoError(err)
		suite.NotNil(readNots)

		allNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, fakePrinc)
		suite.NoError(err)
		suite.Len(allNots.Notifications, 3)

		suite.Len(allNots.UnreadNotifications(), 0)
		suite.EqualValues(0, allNots.NumUnreadNotifications())

	})

}
