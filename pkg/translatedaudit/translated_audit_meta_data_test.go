package translatedaudit

import (
	"time"
)

func (suite *TAuditSuite) TestDiscussionReplyMetaDataGet() {
	plan := suite.createModelPlan("testPlan")
	discussionContent := "Blah blah blah discussion"
	discussion := suite.createPlanDiscussion(plan.ID, discussionContent)
	replyContent := "that's very interesting"

	reply := suite.createDiscussionReply(discussion.ID, replyContent)
	now := time.Now()
	numReplies := 1

	metaData, err := DiscussionReplyMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, reply.ID.String(), discussion.ID.String(), now)
	suite.NoError(err)
	suite.NotNil(metaData)

	suite.EqualValues(discussionContent, metaData.DiscussionContent)
	suite.EqualValues(discussion.ID, metaData.DiscussionID)
	suite.EqualValues(numReplies, metaData.NumberOfReplies)

	suite.EqualValues("discussion_reply", metaData.TableName)
	suite.EqualValues(0, metaData.Version)

}

// OperationalNeedMetaDataGet uses the provided information to generate metadata needed for any operational need audits
func (suite *TAuditSuite) OperationalNeedMetaDataGet() {

}

// OperationalSolutionMetaDataGet uses the provided information to generate metadata needed for any operational solution audits
func (suite *TAuditSuite) OperationalSolutionMetaDataGet() {

}

// OperationalSolutionSubtaskMetaDataGet uses the provided information to generate metadata needed for any operational solution subtask audits.
// it checks if there is a name in the changes, and if so it sets that in the meta data, otherwise it will fetch it from the table record
func (suite *TAuditSuite) OperationalSolutionSubtaskMetaDataGet() {
}

func (suite *TAuditSuite) TranslatedAuditMetaData() {
}
