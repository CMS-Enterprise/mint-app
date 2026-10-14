package notifications

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestModelFollowerUpdateActivityMeta() {
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID
	content := "<p>The <strong>model</strong> has an <u>update</u></p>"

	activity := models.NewModelFollowerUpdateActivity(actorID, modelPlanID, content)

	testActivity, err := activityCreate(suite.testConfigs.Context, suite.testConfigs.Store, activity)
	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityModelFollowerUpdate, testActivity.ActivityType)
	suite.EqualValues(modelPlanID, testActivity.EntityID)
	suite.EqualValues(actorID, testActivity.ActorID)
	suite.Nil(testActivity.MetaData)
	suite.NotNil(testActivity.MetaDataRaw)

	err = testActivity.ParseRawActivityMetaData()
	suite.NoError(err)
	suite.NotNil(testActivity.MetaData)

	meta := testActivity.MetaData.(*models.ModelFollowerUpdateActivityMeta)
	suite.EqualValues(models.ActivityModelFollowerUpdate, meta.Type)
	suite.EqualValues(0, meta.Version)
	suite.EqualValues(modelPlanID, meta.ModelPlanID)
	suite.EqualValues(content, meta.Content)
}
