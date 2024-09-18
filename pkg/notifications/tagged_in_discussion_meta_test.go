package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityTaggedInDiscussionCreate() {

	tag1EUA := "SKZO"
	tag1Principal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, tag1EUA)
	tag1Entity := models.TaggedEntity(tag1Principal.Account())
	suite.NoError(err)
	tag1Label := "Alexander Stark"
	tag1Type := models.TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`
	tag2EUA := "FAKE"
	tag2Principal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, tag2EUA)
	suite.NoError(err)
	tag2Entity := models.TaggedEntity(tag2Principal.Account())
	tag2Label := "Terry Thompson"
	tag2Type := models.TagTypeUserAccount
	tag2 := `<span data-type="mention" tag-type="` + string(tag2Type) + `" class="mention" data-id="` + tag2EUA + `" data-label="` + tag2Label + `">@` + tag2Label + `</span>`
	tag3ID := "CONNECT"
	tag3MockID := 4
	tag3Label := "Salesforce CONNECT"
	tag3Type := models.TagTypePossibleSolution
	tag3 := `<span data-type="mention" tag-type="` + string(tag3Type) + `" class="mention" data-id="` + tag3ID + `" data-label="` + tag3Label + `">@` + tag3Label + `</span>`
	htmlMention := `<p>Hey ` + tag1 + `!  Will you be able to join the meeting next week?  If not, can you contact ` + tag2 + ` to let them know?</p> We are planning on using the ` + tag3 + `solution.` + tag1 + tag1
	// We have made a mention with 5 Mentions. This should only create 5 tags in the database
	taggedContent, err := models.NewTaggedContentFromString(htmlMention)
	suite.NoError(err)
	input := models.TaggedHTML(taggedContent)
	//NOTE, this will fail without properly updating the mentions to point to the DB. We can't test that here because it is part of the resolver package, which calls this package

	// we are just choosing a valid UUID to set for the entityID
	discussionID := uuid.New()
	// we are just choosing a valid UUID to set for the entityID
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID

	mockFunc := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		// Return mock data, all notifications enabled
		return models.NewUserNotificationPreferences(user_id), nil
	}
	for _, mention := range input.Mentions {
		switch mention.EntityRaw {
		case tag1EUA:
			mention.EntityUUID = &tag1Principal.Account().ID
			mention.Entity = &tag1Entity
		case tag2EUA:
			mention.EntityUUID = &tag2Principal.Account().ID
			mention.Entity = &tag2Entity
		case tag3ID:
			mention.EntityIntID = &tag3MockID
			mention.Entity = &tag1Entity //Note this isn't a normal valid case, but this it not used by the test, so it is valid
		}

	}

	testActivity, err := ActivityTaggedInDiscussionCreate(suite.testConfigs.Context, suite.testConfigs.Store, actorID, modelPlanID, discussionID, input, mockFunc)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityTaggedInDiscussion, testActivity.ActivityType)
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

	tag1Nots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, tag1Principal)
	suite.NoError(err)
	suite.EqualValues(1, tag1Nots.NumUnreadNotifications())

	tag2Nots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, tag2Principal)
	suite.NoError(err)
	suite.EqualValues(1, tag2Nots.NumUnreadNotifications())

}
