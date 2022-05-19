package resolvers

import (
	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestCreatePlanDiscussion() {
	plan := suite.createModelPlan("Test Plan")

	input := &model.PlanDiscussionCreateInput{
		ModelPlanID: plan.ID,
		Content:     "This is a test comment",
	}

	result, err := CreatePlanDiscussion(suite.testConfigs.Logger, input, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(plan.ID, result.ModelPlanID)
	suite.EqualValues(input.Content, result.Content)
	suite.EqualValues(models.DiscussionUnAnswered, result.Status)
	suite.Nil(result.ModifiedBy)
	suite.Nil(result.ModifiedDts)
}

func (suite *ResolverSuite) TestUpdatePlanDiscussion() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	changes := map[string]interface{}{
		"content": "This is now updated! Thanks for looking at my test",
		"status":  models.DiscussionAnswered,
	}

	updater := "UPDT"
	result, err := UpdatePlanDiscussion(suite.testConfigs.Logger, discussion.ID, changes, updater, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(discussion.ID, result.ID)
	suite.EqualValues(changes["content"], result.Content)
	suite.EqualValues(changes["status"], result.Status)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, result.CreatedBy)
	suite.EqualValues(updater, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestDeletePlanDiscussion() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	result, err := DeletePlanDiscussion(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(discussion, result)

	// Check that there's no plans for this user
	discussions, err := PlanDiscussionCollectionByModelPlanID(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(discussions, 0)
}

func (suite *ResolverSuite) TestDeletePlanDiscussionWithReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)

	_, err := DeletePlanDiscussion(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	suite.Error(err)
	suite.Contains(err.Error(), "violates foreign key constraint") // maybe a weak check, and should be a custom error type, but works for now
}

func (suite *ResolverSuite) TestCreateDiscussionReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	input := &model.DiscussionReplyCreateInput{
		DiscussionID: discussion.ID,
		Content:      "This is a test reply",
		Resolution:   true,
	}

	result, err := CreateDiscussionReply(suite.testConfigs.Logger, input, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(discussion.ID, result.DiscussionID)
	suite.EqualValues(input.Content, result.Content)
	suite.EqualValues(input.Resolution, result.Resolution)
}

func (suite *ResolverSuite) TestUpdateDiscussionReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	reply := suite.createDiscussionReply(discussion, "This is a test reply", false)
	assert.Nil(suite.T(), reply.ModifiedBy)
	assert.Nil(suite.T(), reply.ModifiedDts)

	changes := map[string]interface{}{
		"content":    "This is now updated! Thanks for looking at my test",
		"resolution": true,
	}

	updater := "UPDT"
	result, err := UpdateDiscussionReply(suite.testConfigs.Logger, reply.ID, changes, updater, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(changes["content"], result.Content)
	suite.EqualValues(changes["resolution"], result.Resolution)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, result.CreatedBy)
	suite.EqualValues(updater, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestDiscussionReplyCollectionByDiscusionID() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", true)

	result, err := DiscussionReplyCollectionByDiscusionID(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(result, 2)

	// Check that adding another dicussion doesn't affect the first one
	discussionTwo := suite.createPlanDiscussion(plan, "This is another test comment")
	_ = suite.createDiscussionReply(discussionTwo, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussionTwo, "This is another test reply", true)
	_ = suite.createDiscussionReply(discussionTwo, "This is a third test reply", true)

	// Assert the count on the _first_ discussion is still 2
	result, err = DiscussionReplyCollectionByDiscusionID(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(result, 2)
}

func (suite *ResolverSuite) TestPlanDiscussionCollectionByModelPlanID() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", true)

	result, err := PlanDiscussionCollectionByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(result, 1)

	// Check that adding another dicussion doesn't affect the first one
	discussionTwo := suite.createPlanDiscussion(plan, "This is another test comment")
	_ = suite.createDiscussionReply(discussionTwo, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussionTwo, "This is another test reply", true)
	_ = suite.createDiscussionReply(discussionTwo, "This is a third test reply", true)

	// Assert the count on the is now 2 after adding another discussion
	result, err = PlanDiscussionCollectionByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(result, 2)
}

func (suite *ResolverSuite) TestDeleteDiscussionReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	reply := suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", false)

	_, err := DeleteDiscussionReply(suite.testConfigs.Logger, reply.ID, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	suite.NoError(err)

	// Should only have 1 left now
	result, err := DiscussionReplyCollectionByDiscusionID(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(result, 1)
}
