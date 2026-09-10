package notifications

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityNewTaskAddedCreate() {
	modelPlanID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID

	receiverPrincipal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	receivers := []*models.UserAccountAndNotificationPreferences{
		{
			UserAccount:     *receiverPrincipal.UserAccount,
			PreferenceFlags: models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		},
	}

	task := models.NewPlanTask(
		actorID,
		modelPlanID,
		models.PlanTaskKeyModelPlan,
		models.PlanTaskStatusToDo,
	)

	testActivity, err := ActivityNewTaskAddedCreate(
		suite.testConfigs.Context,
		actorID,
		suite.testConfigs.Store,
		receivers,
		modelPlanID,
		task,
	)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityNewTaskAdded, testActivity.ActivityType)
	suite.Nil(testActivity.MetaData)
	suite.NotNil(testActivity.MetaDataRaw)

	err = testActivity.ParseRawActivityMetaData()
	suite.NoError(err)
	suite.NotNil(testActivity.MetaData)

	meta := testActivity.MetaData.(*models.NewTaskAddedActivityMeta)
	suite.EqualValues(modelPlanID, meta.ModelPlanID)
	suite.EqualValues(task.ID, meta.PlanTaskID)
	suite.EqualValues(models.PlanTaskKeyModelPlan, meta.TaskKey)

	actorNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.EqualValues(0, actorNots.NumUnreadNotifications())

	receiverNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, receiverPrincipal)
	suite.NoError(err)
	suite.EqualValues(1, receiverNots.NumUnreadNotifications())
}
