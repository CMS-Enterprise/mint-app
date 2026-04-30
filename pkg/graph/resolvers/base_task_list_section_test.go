package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func (suite *ResolverSuite) TestBaseTaskListSectionPreUpdate() {
	modelPlan := suite.createModelPlan("Test plan basics update")

	planBasics, err := suite.testConfigs.Store.PlanBasicsGetByModelPlanID(modelPlan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"modelType": []models.ModelType{models.MTVoluntary},
		"goal":      "Some goal",
	}

	err = BaseTaskListSectionPreUpdate(zap.NewNop(), planBasics, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	//0/5 in Progess
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskInProgress)
	suite.Nil(planBasics.ReadyForReviewDts)
	suite.Nil(planBasics.ReadyForReviewBy)

	// Confirm the MODEL_PLAN task was advanced to IN_PROGRESS when the section first moved to IN_PROGRESS.
	tasks, err := PlanTaskGetByModelPlanIDLOADER(suite.testConfigs.Context, modelPlan.ID)
	suite.NoError(err)
	var modelPlanTask *models.PlanTask
	for _, t := range tasks {
		if t.Key == models.PlanTaskKeyModelPlan {
			modelPlanTask = t
			break
		}
	}
	suite.NotNil(modelPlanTask)
	suite.Equal(models.PlanTaskStatusInProgress, modelPlanTask.Status)

	rev := uuid.MustParse("00000001-0001-0001-0001-000000000009")
	//1/5 Ready for Review
	changes["status"] = models.TaskReadyForReview

	suite.testConfigs.Principal.UserAccount.ID = rev
	err = BaseTaskListSectionPreUpdate(zap.NewNop(), planBasics, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskReadyForReview)
	suite.Equal(*planBasics.ReadyForReviewBy, rev)
	suite.NotNil(planBasics.ReadyForReviewDts)

	//2/5 Ready for Clearance
	changes["status"] = models.TaskReadyForClearance
	err = BaseTaskListSectionPreUpdate(zap.NewNop(), planBasics, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskReadyForClearance)
	suite.Equal(*planBasics.ReadyForReviewBy, rev)
	suite.NotNil(planBasics.ReadyForClearanceDts)

	//3/5 When changed from READY_FOR_CLEARANCE it will always be moved to IN_PROGRESS
	changes["status"] = models.TaskReadyForReview
	err = BaseTaskListSectionPreUpdate(zap.NewNop(), planBasics, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Nil(err)
	suite.EqualValues(planBasics.Status, models.TaskInProgress)

}
