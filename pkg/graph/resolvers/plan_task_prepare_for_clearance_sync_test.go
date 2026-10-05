package resolvers

import (
	"time"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPlanTaskMarkCompletePrepareForClearanceRejected() {
	plan := suite.createModelPlan("Plan For Prepare For Clearance Manual Marking Rejected")

	_, err := PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyPrepareForClearance,
		true,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.Error(err)
}

func (suite *ResolverSuite) TestPrepareForClearancePlanTaskStateSync() {
	plan := suite.createModelPlan("Plan For Prepare For Clearance Task Sync")
	suite.setClearanceStarts(plan.ID, time.Now().AddDate(0, 0, 10))

	task := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyPrepareForClearance)
	suite.Equal(models.PlanTaskStateToDo, task.State)

	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		map[string]interface{}{
			"status": model.TaskStatusInputReadyForClearance,
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)

	task = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyPrepareForClearance)
	suite.Equal(models.PlanTaskStateInProgress, task.State)

	_, err = UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		map[string]interface{}{
			"status": model.TaskStatusInputInProgress,
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)

	task = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyPrepareForClearance)
	suite.Equal(models.PlanTaskStateToDo, task.State)
}

func (suite *ResolverSuite) TestPrepareForClearancePlanTaskCompletesWhenAllSectionsReady() {
	plan := suite.createModelPlan("Plan For Prepare For Clearance Task Complete")
	suite.setClearanceStarts(plan.ID, time.Now().AddDate(0, 0, 10))

	markReady := func(updateFn func(map[string]interface{}) error) {
		suite.NoError(updateFn(map[string]interface{}{
			"status": model.TaskStatusInputReadyForClearance,
		}))
	}

	timeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	markReady(func(changes map[string]interface{}) error {
		_, err := UpdatePlanTimeline(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			timeline.ID,
			changes,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		return err
	})

	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	markReady(func(changes map[string]interface{}) error {
		_, err := UpdatePlanBasics(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			basics.ID,
			changes,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		return err
	})

	gc, err := PlanGeneralCharacteristicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	markReady(func(changes map[string]interface{}) error {
		_, err := UpdatePlanGeneralCharacteristics(
			suite.testConfigs.Logger,
			gc.ID,
			changes,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		return err
	})

	pp, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	markReady(func(changes map[string]interface{}) error {
		_, err := PlanParticipantsAndProvidersUpdate(
			suite.testConfigs.Logger,
			pp.ID,
			changes,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		return err
	})

	bene, err := PlanBeneficiariesGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	markReady(func(changes map[string]interface{}) error {
		_, err := PlanBeneficiariesUpdate(
			suite.testConfigs.Logger,
			bene.ID,
			changes,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		return err
	})

	oel, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	markReady(func(changes map[string]interface{}) error {
		_, err := PlanOpsEvalAndLearningUpdate(
			suite.testConfigs.Logger,
			oel.ID,
			changes,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		return err
	})

	payments, err := PlanPaymentsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	markReady(func(changes map[string]interface{}) error {
		_, err := PlanPaymentsUpdate(
			suite.testConfigs.Logger,
			suite.testConfigs.Store,
			payments.ID,
			changes,
			suite.testConfigs.Principal,
		)
		return err
	})

	task := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyPrepareForClearance)
	suite.Equal(models.PlanTaskStateComplete, task.State)
}

func (suite *ResolverSuite) TestPrepareForClearancePlanTaskRevertsToUpcomingWhenClearanceDateMovesOut() {
	plan := suite.createModelPlan("Plan For Prepare For Clearance Date Revert")
	suite.setClearanceStarts(plan.ID, time.Now().AddDate(0, 0, 10))

	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	_, err = UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		map[string]interface{}{
			"status": model.TaskStatusInputReadyForClearance,
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)

	updatedBasics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.EqualValues(models.TaskReadyForClearance, updatedBasics.Status)

	suite.setClearanceStarts(plan.ID, time.Now().AddDate(0, 0, 25))

	task := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyPrepareForClearance)
	suite.Equal(models.PlanTaskStateUpcoming, task.State)

	updatedBasics, err = PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.EqualValues(models.TaskInProgress, updatedBasics.Status)
	suite.Nil(updatedBasics.ReadyForClearanceDts)
}
