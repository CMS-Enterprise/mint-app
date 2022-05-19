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
	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), result.ID)
	assert.EqualValues(suite.T(), plan.ID, result.ModelPlanID)
	assert.EqualValues(suite.T(), input.Content, result.Content)
	assert.Nil(suite.T(), result.ModifiedBy)
	assert.EqualValues(suite.T(), models.DiscussionUnAnswered, result.Status)
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

	assert.NoError(suite.T(), err)
	assert.EqualValues(suite.T(), discussion.ID, result.ID)
	assert.EqualValues(suite.T(), changes["content"], result.Content)
	assert.EqualValues(suite.T(), changes["status"], result.Status)
	assert.EqualValues(suite.T(), suite.testConfigs.UserInfo.EuaUserID, result.CreatedBy)
	assert.NotNil(suite.T(), result.ModifiedBy)
	assert.EqualValues(suite.T(), updater, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestDeletePlanDiscussion() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	result, err := DeletePlanDiscussion(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	assert.NoError(suite.T(), err)
	assert.EqualValues(suite.T(), discussion, result)

	// Check that there's no plans for this user
	discussions, err := PlanDiscussionCollectionByModelPlanID(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Store)
	assert.NoError(suite.T(), err)
	assert.Len(suite.T(), discussions, 0)
}

func (suite *ResolverSuite) TestDeletePlanDiscussionWithReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)

	_, err := DeletePlanDiscussion(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	assert.Error(suite.T(), err)
	assert.Contains(suite.T(), err.Error(), "violates foreign key constraint") // maybe a weak check, and should be a custom error type, but works for now
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
	assert.NoError(suite.T(), err)
	assert.NotNil(suite.T(), result.ID)
	assert.EqualValues(suite.T(), discussion.ID, result.DiscussionID)
	assert.EqualValues(suite.T(), input.Content, result.Content)
	assert.EqualValues(suite.T(), input.Resolution, result.Resolution)
}

func (suite *ResolverSuite) TestUpdateDiscussionReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	reply := suite.createDiscussionReply(discussion, "This is a test reply", false)
	assert.Nil(suite.T(), reply.ModifiedBy)

	changes := map[string]interface{}{
		"content":    "This is now updated! Thanks for looking at my test",
		"resolution": true,
	}
	updater := "UPDT"
	result, err := UpdateDiscussionReply(suite.testConfigs.Logger, reply.ID, changes, updater, suite.testConfigs.Store)

	assert.NoError(suite.T(), err)
	assert.EqualValues(suite.T(), changes["content"], result.Content)
	assert.EqualValues(suite.T(), changes["resolution"], result.Resolution)
	assert.EqualValues(suite.T(), suite.testConfigs.UserInfo.EuaUserID, result.CreatedBy)
	assert.EqualValues(suite.T(), updater, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestDiscussionReplyCollectionByDiscusionID() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", true)

	result, err := DiscussionReplyCollectionByDiscusionID(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Store)
	assert.NoError(suite.T(), err)
	assert.Len(suite.T(), result, 2)

	// Check that adding another dicussion doesn't affect the first one
	discussionTwo := suite.createPlanDiscussion(plan, "This is another test comment")
	_ = suite.createDiscussionReply(discussionTwo, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussionTwo, "This is another test reply", true)
	_ = suite.createDiscussionReply(discussionTwo, "This is a third test reply", true)

	// Assert the count on the _first_ discussion is still 2
	result, err = DiscussionReplyCollectionByDiscusionID(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Store)
	assert.NoError(suite.T(), err)
	assert.Len(suite.T(), result, 2)
}

func (suite *ResolverSuite) TestPlanDiscussionCollectionByModelPlanID() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", true)

	result, err := PlanDiscussionCollectionByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	assert.NoError(suite.T(), err)
	assert.Len(suite.T(), result, 1)

	// Check that adding another dicussion doesn't affect the first one
	discussionTwo := suite.createPlanDiscussion(plan, "This is another test comment")
	_ = suite.createDiscussionReply(discussionTwo, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussionTwo, "This is another test reply", true)
	_ = suite.createDiscussionReply(discussionTwo, "This is a third test reply", true)

	// Assert the count on the is now 2 after adding another discussion
	result, err = PlanDiscussionCollectionByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	assert.NoError(suite.T(), err)
	assert.Len(suite.T(), result, 2)
}

func (suite *ResolverSuite) TestDeleteDiscussionReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	reply := suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", false)

	_, err := DeleteDiscussionReply(suite.testConfigs.Logger, reply.ID, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	assert.NoError(suite.T(), err)

	// Should only have 1 left now
	result, err := DiscussionReplyCollectionByDiscusionID(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Store)
	assert.NoError(suite.T(), err)
	assert.Len(suite.T(), result, 1)
}
