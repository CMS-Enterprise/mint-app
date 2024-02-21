package notifications

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/testconfig/useraccountstoretestconfigs"
)

func (suite *NotificationsSuite) TestUserNotificationCreate() {

	// we are just choosing a valid UUID to set for the entityID
	discussionID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	testContent := "test content"

	// testCollab := models.NewActivity(suite.testConfigs.Principal.Account().ID, entityID, models.ActivityAddedAsCollaborator)
	testActivity := models.NewTaggedInPlanDiscussionActivity(actorID, discussionID, testContent)

	createdActivity, err := activityCreate(suite.testConfigs.Context, suite.testConfigs.Store, testActivity)
	suite.NoError(err)
	suite.NotNil(createdActivity)

	fakePrinc, err := useraccountstoretestconfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	preferenceFlag := models.UserNotificationPreferenceInAppOnly
	notification, err := userNotificationCreate(suite.testConfigs.Context, suite.testConfigs.Store, createdActivity, fakePrinc.Account().ID, preferenceFlag)
	suite.NoError(err)
	suite.NotNil(notification)

	// Assert expected values
	suite.EqualValues(createdActivity.ID, notification.ActivityID)
	suite.EqualValues(notification.UserID, fakePrinc.Account().ID)
	suite.EqualValues(notification.CreatedBy, createdActivity.ActorID)
	suite.EqualValues(notification.EmailSent, false)
	suite.EqualValues(notification.InAppSent, true)

}
