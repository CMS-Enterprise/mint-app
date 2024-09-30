package notifications

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityCreate() {
	// we are just choosing a valid UUID to set for the entityID
	modelPlanID := uuid.New()
	discussionID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	testContent := "test content"

	testActivity := models.NewTaggedInPlanDiscussionActivity(actorID, modelPlanID, discussionID, testContent)

	createdActivity, err := activityCreate(suite.testConfigs.Context, suite.testConfigs.Store, testActivity)
	suite.NoError(err)
	suite.NotNil(createdActivity)

	suite.EqualValues(discussionID, createdActivity.EntityID)
	suite.EqualValues(actorID, createdActivity.ActorID)
	suite.EqualValues(actorID, createdActivity.CreatedBy)
	suite.EqualValues(models.ActivityTaggedInDiscussion, createdActivity.ActivityType)
}
