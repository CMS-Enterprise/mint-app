package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityNewDiscussionRepliedCreate() {
	html := `<p>Hey there!  Are you available for a quick sync on thjis issue? Thanks!</p>`

	taggedContent, err := models.NewTaggedContentFromString(html)
	suite.NoError(err)

	//Note: this will fail without properly updating the mentions to point to the DB.
	// We can't test that here because it is part of the resolver package, which calls this package
	input := models.TaggedHTML(taggedContent)

	// we are just choosing a valid UUID to set for the entityID
	modelPlanID := uuid.New()
	discussionID := uuid.New()
	replyID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID

	mockFunc := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		// Return mock data, all notifications enabled
		return models.NewUserNotificationPreferences(user_id), nil
	}

	testActivity, err := ActivityNewDiscussionRepliedCreate(suite.testConfigs.Context, suite.testConfigs.Store, actorID, modelPlanID, discussionID, replyID, input, mockFunc)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityNewDiscussionReply, testActivity.ActivityType)
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
}
