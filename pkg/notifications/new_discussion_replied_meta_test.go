package notifications

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityNewDiscussionRepliedCreate() {

	html := `<p>Hey there! Are you available for a quick sync on this issue? Thanks!</p>`
	taggedContent, err := models.NewTaggedContentFromString(html)
	suite.NoError(err)
	input := models.TaggedHTML(taggedContent)

	modelPlanID := uuid.New() // We are just choosing a valid UUID to set for the entityID
	discussionID := uuid.New()
	replyID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	userPrefs := models.NewUserNotificationPreferences(actorID)

	discussionCreator, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FRED")
	suite.NoError(err)

	testActivity, err := ActivityNewDiscussionRepliedCreate(suite.testConfigs.Context, suite.testConfigs.Store, actorID, modelPlanID, discussionID, discussionCreator.Account().ID, replyID, input, userPrefs)
	suite.NoError(err)

	// Assert about notification object creation
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityNewDiscussionReply, testActivity.ActivityType)

	// Assert about notification delivery
	actorNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.EqualValues(0, actorNots.NumUnreadNotifications())

	recipientNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, discussionCreator)
	suite.NoError(err)
	suite.EqualValues(1, recipientNots.NumUnreadNotifications())

	// Assert about meta data values
	meta := suite.deserializeActivityMetadata(testActivity)
	suite.EqualValues(input.RawContent.String(), meta.(*models.NewDiscussionRepliedActivityMeta).Content)
	suite.EqualValues(discussionID, meta.(*models.NewDiscussionRepliedActivityMeta).DiscussionID)
	suite.EqualValues(modelPlanID, meta.(*models.NewDiscussionRepliedActivityMeta).ModelPlanID)
	suite.EqualValues(replyID, meta.(*models.NewDiscussionRepliedActivityMeta).ReplyID)
}
