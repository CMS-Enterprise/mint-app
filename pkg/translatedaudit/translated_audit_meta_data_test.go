package translatedaudit

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/models"
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

	tableName := "discussion_reply"
	suite.EqualValues(tableName, metaData.TableName)
	suite.EqualValues(0, metaData.Version)

}

func (suite *TAuditSuite) TestOperationalNeedMetaDataGet() {

}

func (suite *TAuditSuite) TestOperationalSolutionMetaDataGet() {
	plan := suite.createModelPlan("test plan")
	needName := "To test operational solution meta data"
	need := suite.createOperationalNeed(plan.ID, needName)
	solName := "make a unit test"
	mustFinish := time.Now().UTC()
	mustStart := mustFinish.Add(-24 * time.Hour)
	solStatus := models.OpSAtRisk
	solOtherHeader := models.StringPointer("hooray! It's the other header!")
	sol := suite.createOperationalSolution(need.ID, solName, func(os *models.OperationalSolution) {
		os.MustStartDts = &mustStart
		os.MustFinishDts = &mustFinish
		os.Status = solStatus
		os.OtherHeader = solOtherHeader
	})
	// the test function makes a custom solution
	needIsOther := true
	solIsOther := true

	metaData, metaDataType, err := OperationalSolutionMetaDataGet(suite.testConfigs.Context, suite.testConfigs.Store, sol.ID.String())

	suite.NoError(err)
	suite.NotNil(metaData)

	if suite.NotNil(metaDataType) {
		suite.EqualValues(models.TAMetaOperationalSolution, *metaDataType)
	}

	//Changes: (Testing) expand this
	suite.EqualValues(needName, metaData.NeedName)
	suite.EqualValues(needIsOther, metaData.NeedIsOther)
	suite.EqualValues(0, metaData.NumberOfSubtasks)

	suite.EqualValues(solName, metaData.SolutionName)
	if suite.NotNil(metaData.SolutionMustFinish) {
		suite.EqualValues(mustFinish, metaData.SolutionMustFinish.UTC())
	}

	if suite.NotNil(metaData.SolutionMustStart) {
		suite.EqualValues(mustStart, metaData.SolutionMustStart.UTC())
	}
	suite.EqualValues(solStatus, metaData.SolutionStatus)
	suite.EqualValues(solIsOther, metaData.SolutionIsOther)
	suite.EqualValues(solOtherHeader, metaData.SolutionOtherHeader)

	tableName := "operational_solution"
	suite.EqualValues(tableName, metaData.TableName)
	suite.EqualValues(0, metaData.Version)

}

func (suite *TAuditSuite) TestOperationalSolutionSubtaskMetaDataGet() {
}

func (suite *TAuditSuite) TestTranslatedAuditMetaData() {
}
