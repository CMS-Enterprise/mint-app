package resolvers

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/constants"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func (suite *ResolverSuite) TestPlanTaskStatusResolver() {
	r := &planTaskResolver{&Resolver{}}

	// nil object should safely default to TO_DO
	status, err := r.Status(suite.testConfigs.Context, nil)
	suite.NoError(err)
	suite.Equal(model.PlanTaskStatusToDo, status)

	// Every non-complete state should map to TO_DO status
	for _, state := range []models.PlanTaskState{
		models.PlanTaskStateNotNeeded,
		models.PlanTaskStateUpcoming,
		models.PlanTaskStateToDo,
		models.PlanTaskStateInProgress,
	} {
		task := &models.PlanTask{State: state}
		status, err = r.Status(suite.testConfigs.Context, task)
		suite.NoError(err)
		suite.Equal(model.PlanTaskStatusToDo, status, "expected state %s to map to TO_DO status", state)
	}

	// COMPLETE state should map to COMPLETE status
	taskComplete := &models.PlanTask{State: models.PlanTaskStateComplete}
	status, err = r.Status(suite.testConfigs.Context, taskComplete)
	suite.NoError(err)
	suite.Equal(model.PlanTaskStatusComplete, status)
}

func (suite *ResolverSuite) TestModelPlanTasksResolver() {
	plan := suite.createModelPlan("Plan With Tasks")

	r := &Resolver{
		store: suite.testConfigs.Store,
	}
	mpResolver := &modelPlanResolver{r}

	tasks, err := mpResolver.Tasks(suite.testConfigs.Context, plan)
	suite.NoError(err)
	suite.NotNil(tasks)
	suite.GreaterOrEqual(len(tasks), 1)

	for _, t := range tasks {
		suite.Equal(plan.ID, t.ModelPlanID)
	}
}

func (suite *ResolverSuite) TestPlanTaskMarkComplete() {
	plan := suite.createModelPlan("Plan For Manual Task Marking")

	// mark the TWO_PAGER task complete
	updated, err := PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyTwoPager,
		true,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	if suite.NotNil(updated) {
		suite.Equal(models.PlanTaskStateComplete, updated.State)
		if suite.NotNil(updated.CompletedBy) {
			suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updated.CompletedBy)
		}
		suite.NotNil(updated.CompletedDts)
	}

	task := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyTwoPager)
	suite.Equal(models.PlanTaskStateComplete, task.State)

	// mark it back to TO_DO
	updated, err = PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyTwoPager,
		false,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	if suite.NotNil(updated) {
		suite.Equal(models.PlanTaskStateToDo, updated.State)
		suite.Nil(updated.CompletedBy)
		suite.Nil(updated.CompletedDts)
	}

	task = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyTwoPager)
	suite.Equal(models.PlanTaskStateToDo, task.State)
	suite.Nil(task.CompletedBy)
	suite.Nil(task.CompletedDts)
}

func (suite *ResolverSuite) TestPlanTaskMarkCompleteActivatesSixPager() {
	plan := suite.createModelPlan("Plan For Six Pager Activation")

	sixPagerTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeySixPager)
	suite.Equal(models.PlanTaskStateUpcoming, sixPagerTask.State)

	// marking TWO_PAGER complete activates SIX_PAGER from UPCOMING to TO_DO
	_, err := PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyTwoPager,
		true,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	sixPagerTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeySixPager)
	suite.Equal(models.PlanTaskStateToDo, sixPagerTask.State)
	suite.Nil(sixPagerTask.CompletedBy)
	suite.Nil(sixPagerTask.CompletedDts)

	// the activation itself is attributed to the MINT system account, not the user who completed
	// TWO_PAGER, so Change History correctly shows it as an automatic change (see
	// isPlanTaskAutomaticChange in src/features/ModelPlan/ChangeHistory/util.tsx)
	if suite.NotNil(sixPagerTask.ModifiedBy) {
		suite.Equal(constants.GetSystemAccountUUID(), *sixPagerTask.ModifiedBy)
	}

	twoPagerTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyTwoPager)
	if suite.NotNil(twoPagerTask.ModifiedBy) {
		suite.Equal(suite.testConfigs.Principal.Account().ID, *twoPagerTask.ModifiedBy)
	}

	// marking TWO_PAGER back to incomplete does not revert SIX_PAGER's activation (one-way)
	_, err = PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyTwoPager,
		false,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	sixPagerTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeySixPager)
	suite.Equal(models.PlanTaskStateToDo, sixPagerTask.State)
}

func (suite *ResolverSuite) TestPlanTaskMarkCompleteSixPager() {
	plan := suite.createModelPlan("Plan For Six Pager Manual Task Marking")

	// SIX_PAGER starts UPCOMING and isn't activated to TO_DO until TWO_PAGER is marked complete
	_, err := PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyTwoPager,
		true,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	sixPagerTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeySixPager)
	suite.Equal(models.PlanTaskStateToDo, sixPagerTask.State)

	// mark the SIX_PAGER task complete
	updated, err := PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeySixPager,
		true,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	if suite.NotNil(updated) {
		suite.Equal(models.PlanTaskStateComplete, updated.State)
		if suite.NotNil(updated.CompletedBy) {
			suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updated.CompletedBy)
		}
		suite.NotNil(updated.CompletedDts)
	}

	sixPagerTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeySixPager)
	suite.Equal(models.PlanTaskStateComplete, sixPagerTask.State)

	// mark it back to TO_DO
	updated, err = PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeySixPager,
		false,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)
	if suite.NotNil(updated) {
		suite.Equal(models.PlanTaskStateToDo, updated.State)
		suite.Nil(updated.CompletedBy)
		suite.Nil(updated.CompletedDts)
	}

	sixPagerTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeySixPager)
	suite.Equal(models.PlanTaskStateToDo, sixPagerTask.State)
	suite.Nil(sixPagerTask.CompletedBy)
	suite.Nil(sixPagerTask.CompletedDts)
}

// TestSixPagerStatusStaysToDoThroughActivation confirms the computed status field on the
// 6-pager card stays TO_DO across the UPCOMING -> TO_DO state activation trigger, end to end
// through the resolver (not just the Status function in isolation). Status is binary
// (TO_DO/COMPLETE), so unlike state it does not distinguish UPCOMING from TO_DO.
func (suite *ResolverSuite) TestSixPagerStatusStaysToDoThroughActivation() {
	plan := suite.createModelPlan("Plan For Six Pager State Display")
	r := &planTaskResolver{&Resolver{}}

	sixPagerTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeySixPager)
	suite.Equal(models.PlanTaskStateUpcoming, sixPagerTask.State)
	status, err := r.Status(suite.testConfigs.Context, sixPagerTask)
	suite.NoError(err)
	suite.Equal(model.PlanTaskStatusToDo, status)

	_, err = PlanTaskMarkComplete(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyTwoPager,
		true,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	sixPagerTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeySixPager)
	suite.Equal(models.PlanTaskStateToDo, sixPagerTask.State)
	status, err = r.Status(suite.testConfigs.Context, sixPagerTask)
	suite.NoError(err)
	suite.Equal(model.PlanTaskStatusToDo, status)
}

func (suite *ResolverSuite) TestPlanTaskMarkCompleteRejectsCalculatedKeys() {
	plan := suite.createModelPlan("Plan For Rejected Manual Task Marking")

	for _, key := range []models.PlanTaskKey{
		models.PlanTaskKeyModelPlan,
		models.PlanTaskKeyMto,
		models.PlanTaskKeyDataExchange,
	} {
		updated, err := PlanTaskMarkComplete(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			plan.ID,
			key,
			true,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.Error(err, "expected key %s to be rejected as not manually markable", key)
		suite.Nil(updated)

		// confirm the task was left untouched
		task := suite.getPlanTaskByKey(plan.ID, key)
		suite.Equal(models.PlanTaskStateToDo, task.State)
		suite.Nil(task.CompletedBy)
		suite.Nil(task.CompletedDts)
	}
}

func (suite *ResolverSuite) TestModelPlanCreateCreatesDefaultTasks() {
	plan := suite.createModelPlan("Plan With Default Tasks")

	tasks, err := PlanTaskGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(tasks, 5)

	taskByKey := planTasksByKey(tasks)
	suite.NotNil(taskByKey[models.PlanTaskKeyModelPlan])
	suite.NotNil(taskByKey[models.PlanTaskKeyMto])
	suite.NotNil(taskByKey[models.PlanTaskKeyDataExchange])
	suite.NotNil(taskByKey[models.PlanTaskKeyTwoPager])
	suite.NotNil(taskByKey[models.PlanTaskKeySixPager])

	for _, t := range tasks {
		suite.Equal(plan.ID, t.ModelPlanID)
		suite.Nil(t.CompletedBy)
		suite.Nil(t.CompletedDts)
		if t.Key == models.PlanTaskKeySixPager {
			suite.Equal(models.PlanTaskStateUpcoming, t.State)
		} else {
			suite.Equal(models.PlanTaskStateToDo, t.State)
		}
	}
}

func (suite *ResolverSuite) TestPlanTaskStateTransitions() {
	plan := suite.createModelPlan("Plan For Task Transitions")

	suite.Run("starting model plan marks MODEL_PLAN task IN_PROGRESS", func() {
		basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
		suite.NoError(err)
		suite.NotNil(basics)

		changes := map[string]interface{}{
			"goal": "Updated goal to start plan",
		}
		_, err = UpdatePlanBasics(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			basics.ID,
			changes,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		task := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyModelPlan)
		suite.Equal(models.PlanTaskStateInProgress, task.State)
		suite.Nil(task.CompletedBy)
		suite.Nil(task.CompletedDts)
	})

	suite.Run("starting MTO marks only MTO task IN_PROGRESS", func() {
		_, err := MTOCategoryCreate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			"Test Category",
			plan.ID,
			nil,
		)
		suite.NoError(err)

		mtoTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyMto)
		dataExchangeTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStateInProgress, mtoTask.State)
		suite.Equal(models.PlanTaskStateToDo, dataExchangeTask.State)
	})

	suite.Run("creating common milestone marks MTO task IN_PROGRESS", func() {
		planWithMilestone := suite.createModelPlan("Plan For Common Milestone Start")
		commonMilestones, err := MTOCommonMilestoneGetByModelPlanIDLOADER(suite.testConfigs.Context, nil)
		suite.NoError(err)
		suite.NotEmpty(commonMilestones)
		commonMilestone := commonMilestones[0]

		_, err = MTOMilestoneCreateCommon(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
			planWithMilestone.ID,
			commonMilestone.ID,
			[]models.MTOCommonSolutionKey{},
		)
		suite.NoError(err)

		mtoTask := suite.getPlanTaskByKey(planWithMilestone.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStateInProgress, mtoTask.State)
	})

	suite.Run("creating common solution marks MTO task IN_PROGRESS", func() {
		planWithSolution := suite.createModelPlan("Plan For Common Solution Start")

		_, err := MTOSolutionCreateCommon(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
			planWithSolution.ID,
			models.MTOCSKInnovation,
			[]uuid.UUID{},
		)
		suite.NoError(err)

		mtoTask := suite.getPlanTaskByKey(planWithSolution.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStateInProgress, mtoTask.State)
	})

	suite.Run("creating standard categories marks MTO task IN_PROGRESS", func() {
		planWithStandards := suite.createModelPlan("Plan For Standard Categories Start")

		_, err := MTOCreateStandardCategories(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			planWithStandards.ID,
		)
		suite.NoError(err)

		mtoTask := suite.getPlanTaskByKey(planWithStandards.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStateInProgress, mtoTask.State)
	})

	suite.Run("deleting last MTO data recalculates MTO task to TO_DO", func() {
		planForMTODeleteRegression := suite.createModelPlan("Plan For MTO Delete Regression")

		category, err := MTOCategoryCreate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			"Category To Delete",
			planForMTODeleteRegression.ID,
			nil,
		)
		suite.NoError(err)
		suite.NotNil(category)

		mtoTask := suite.getPlanTaskByKey(planForMTODeleteRegression.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStateInProgress, mtoTask.State)

		err = MTOCategoryDelete(
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			category.ID,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		mtoTask = suite.getPlanTaskByKey(planForMTODeleteRegression.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStateToDo, mtoTask.State)
		suite.Nil(mtoTask.CompletedBy)
		suite.Nil(mtoTask.CompletedDts)
	})

	suite.Run("starting data exchange approach marks DATA_EXCHANGE task IN_PROGRESS", func() {
		dea, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
		suite.NoError(err)
		suite.NotNil(dea)

		_, err = PlanDataExchangeApproachUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			dea.ID,
			map[string]interface{}{"newDataExchangeMethodsDescription": "Start data exchange approach"},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		dataExchangeTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStateInProgress, dataExchangeTask.State)
	})

	suite.Run("marking data exchange approach complete marks DATA_EXCHANGE task COMPLETE", func() {
		dea, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
		suite.NoError(err)
		suite.NotNil(dea)

		isComplete := true
		_, err = PlanDataExchangeApproachUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			dea.ID,
			map[string]interface{}{"isDataExchangeApproachComplete": &isComplete},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		task := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStateComplete, task.State)
		if suite.NotNil(task.CompletedBy) {
			suite.Equal(suite.testConfigs.Principal.Account().ID, *task.CompletedBy)
		}
		suite.NotNil(task.CompletedDts)
	})

	suite.Run("unmarking data exchange approach complete regresses DATA_EXCHANGE to IN_PROGRESS when model is not CLEARED", func() {
		planForDEARegression := suite.createModelPlan("Plan For DEA Uncomplete Regression")

		dea, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, planForDEARegression.ID)
		suite.NoError(err)
		suite.NotNil(dea)

		isComplete := true
		_, err = PlanDataExchangeApproachUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			dea.ID,
			map[string]interface{}{"isDataExchangeApproachComplete": &isComplete},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		isComplete = false
		_, err = PlanDataExchangeApproachUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			dea.ID,
			map[string]interface{}{"isDataExchangeApproachComplete": &isComplete},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		task := suite.getPlanTaskByKey(planForDEARegression.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStateInProgress, task.State)
		suite.Nil(task.CompletedBy)
		suite.Nil(task.CompletedDts)
	})

	suite.Run("unmarking data exchange approach complete keeps DATA_EXCHANGE complete when model is CLEARED", func() {
		planForDEACleared := suite.createModelPlan("Plan For DEA Uncomplete While Cleared")

		dea, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, planForDEACleared.ID)
		suite.NoError(err)
		suite.NotNil(dea)

		isComplete := true
		_, err = PlanDataExchangeApproachUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			dea.ID,
			map[string]interface{}{"isDataExchangeApproachComplete": &isComplete},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		_, err = ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			planForDEACleared.ID,
			map[string]interface{}{"status": models.ModelStatusCleared},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		isComplete = false
		_, err = PlanDataExchangeApproachUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			dea.ID,
			map[string]interface{}{"isDataExchangeApproachComplete": &isComplete},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		task := suite.getPlanTaskByKey(planForDEACleared.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStateComplete, task.State)
		suite.NotNil(task.CompletedBy)
		suite.NotNil(task.CompletedDts)
	})

	suite.Run("status transitions on model plan update set appropriate tasks COMPLETE", func() {
		// When model status changes to CLEARED: MODEL_PLAN and DATA_EXCHANGE tasks COMPLETE
		_, err := ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			plan.ID,
			map[string]interface{}{"status": models.ModelStatusCleared},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		modelPlanTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyModelPlan)
		dataExchangeTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStateComplete, modelPlanTask.State)
		suite.NotNil(modelPlanTask.CompletedBy)
		suite.NotNil(modelPlanTask.CompletedDts)
		suite.Equal(models.PlanTaskStateComplete, dataExchangeTask.State)
		suite.NotNil(dataExchangeTask.CompletedBy)
		suite.NotNil(dataExchangeTask.CompletedDts)

		// When model status regresses from CLEARED to an earlier status:
		// MODEL_PLAN should return to IN_PROGRESS, while DATA_EXCHANGE remains COMPLETE if DEA is still COMPLETE.
		_, err = ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			plan.ID,
			map[string]interface{}{"status": models.ModelStatusInternalCmmiClearance},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		modelPlanTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyModelPlan)
		dataExchangeTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStateInProgress, modelPlanTask.State)
		suite.Nil(modelPlanTask.CompletedBy)
		suite.Nil(modelPlanTask.CompletedDts)
		suite.Equal(models.PlanTaskStateComplete, dataExchangeTask.State)
		suite.NotNil(dataExchangeTask.CompletedBy)
		suite.NotNil(dataExchangeTask.CompletedDts)

		// When model status changes to ACTIVE: MTO task COMPLETE
		_, err = ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			plan.ID,
			map[string]interface{}{"status": models.ModelStatusActive},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		mtoTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStateComplete, mtoTask.State)
		suite.NotNil(mtoTask.CompletedBy)
		suite.NotNil(mtoTask.CompletedDts)

		// When model status regresses from ACTIVE to an earlier status:
		// MTO task should return to IN_PROGRESS if MTO data exists.
		_, err = ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			plan.ID,
			map[string]interface{}{"status": models.ModelStatusAnnounced},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		mtoTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStateInProgress, mtoTask.State)
		suite.Nil(mtoTask.CompletedBy)
		suite.Nil(mtoTask.CompletedDts)
	})

	suite.Run("regressing from ACTIVE returns MTO to TO_DO when no MTO data exists", func() {
		planWithoutMTOData := suite.createModelPlan("Plan For Active Regression Without MTO Data")

		_, err := ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			planWithoutMTOData.ID,
			map[string]interface{}{"status": models.ModelStatusActive},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		_, err = ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			planWithoutMTOData.ID,
			map[string]interface{}{"status": models.ModelStatusAnnounced},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		mtoTask := suite.getPlanTaskByKey(planWithoutMTOData.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStateToDo, mtoTask.State)
		suite.Nil(mtoTask.CompletedBy)
		suite.Nil(mtoTask.CompletedDts)
	})

	suite.Run("regressing from CLEARED downgrades DATA_EXCHANGE when DEA is not COMPLETE", func() {
		planForRegression := suite.createModelPlan("Plan For DEA Regression")

		_, err := ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			planForRegression.ID,
			map[string]interface{}{"status": models.ModelStatusCleared},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		_, err = ModelPlanUpdate(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			planForRegression.ID,
			map[string]interface{}{"status": models.ModelStatusInternalCmmiClearance},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
		)
		suite.NoError(err)

		modelPlanTask := suite.getPlanTaskByKey(planForRegression.ID, models.PlanTaskKeyModelPlan)
		dataExchangeTask := suite.getPlanTaskByKey(planForRegression.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStateToDo, modelPlanTask.State)
		suite.Nil(modelPlanTask.CompletedBy)
		suite.Nil(modelPlanTask.CompletedDts)
		suite.Equal(models.PlanTaskStateToDo, dataExchangeTask.State)
		suite.Nil(dataExchangeTask.CompletedBy)
		suite.Nil(dataExchangeTask.CompletedDts)
	})
}

func (suite *ResolverSuite) TestPlanTaskDataLoader() {
	plan1 := suite.createModelPlan("Plan For Task Loader 1")
	plan2 := suite.createModelPlan("Plan For Task Loader 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyPlanTaskLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyPlanTaskLoader(ctx, plan2.ID)
	})

	err := g.Wait()
	suite.NoError(err)
}

func verifyPlanTaskLoader(ctx context.Context, modelPlanID uuid.UUID) error {
	tasks, err := PlanTaskGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if len(tasks) < 1 {
		return fmt.Errorf("plan task check didn't return any tasks")
	}

	for _, t := range tasks {
		if modelPlanID != t.ModelPlanID {
			return fmt.Errorf("plan task returned model plan ID %s, expected %s", t.ModelPlanID, modelPlanID)
		}
	}

	return nil
}

func (suite *ResolverSuite) getPlanTaskByKey(modelPlanID uuid.UUID, key models.PlanTaskKey) *models.PlanTask {
	tasks, err := PlanTaskGetByModelPlanIDLOADER(suite.testConfigs.Context, modelPlanID)
	suite.NoError(err)
	task := planTasksByKey(tasks)[key]
	suite.NotNil(task)
	return task
}

func planTasksByKey(tasks []*models.PlanTask) map[models.PlanTaskKey]*models.PlanTask {
	taskByKey := map[models.PlanTaskKey]*models.PlanTask{}
	for _, t := range tasks {
		taskByKey[t.Key] = t
	}
	return taskByKey
}

func (suite *ResolverSuite) TestTrySendPlanTaskNewAvailableNotificationsEmailRecipients() {
	plan := suite.createModelPlan("Plan For New Task Available Email Recipients")
	optedInCollaborator := suite.createPlanCollaborator(plan, "NTAE", []models.TeamRole{models.TeamRoleLeadership})
	optedOutCollaborator := suite.createPlanCollaborator(plan, "NTAN", []models.TeamRole{models.TeamRoleLeadership})
	optedInPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "NTAE")

	_, err := UserNotificationPreferencesUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		optedInPrincipal,
		suite.testConfigs.Store,
		map[string]interface{}{
			"newTaskAdded": models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceEmail},
		},
	)
	suite.NoError(err)

	mockController := gomock.NewController(suite.T())
	defer mockController.Finish()
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailService.EXPECT().GetConfig().Return(&oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}).AnyTimes()

	type sentEmail struct {
		body string
		bcc  []string
	}
	var (
		mu         sync.Mutex
		wg         sync.WaitGroup
		sentEmails []sentEmail
	)
	wg.Add(2)
	mockEmailService.EXPECT().
		Send(
			gomock.Eq("unit-test-execution@mint.cms.gov"),
			gomock.Eq([]string{}),
			gomock.Nil(),
			gomock.Any(),
			gomock.Eq("text/html"),
			gomock.Any(),
			gomock.Any(),
		).
		DoAndReturn(func(_ string, _, _ []string, _, _ string, body string, opts ...oddmail.EmailOption) error {
			var emailOptions oddmail.EmailOptions
			for _, opt := range opts {
				opt(&emailOptions)
			}

			mu.Lock()
			sentEmails = append(sentEmails, sentEmail{
				body: body,
				bcc:  emailOptions.BccAddresses,
			})
			mu.Unlock()
			wg.Done()
			return nil
		}).
		Times(2)

	trySendPlanTaskNewAvailableNotifications(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		plan.ID,
		suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyModelPlan),
		suite.testConfigs.Principal,
		mockEmailService,
		email.AddressBook{DefaultSender: "unit-test-execution@mint.cms.gov"},
	)

	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(2 * time.Second):
		suite.FailNow("timed out waiting for new task available emails to send")
	}

	suite.Len(sentEmails, 2)

	leadEmail := suite.testConfigs.Principal.Account().Email
	nonLeadEmail, err := optedInCollaborator.UserAccount(suite.testConfigs.Context)
	suite.NoError(err)
	optedOutEmail, err := optedOutCollaborator.UserAccount(suite.testConfigs.Context)
	suite.NoError(err)

	for _, sent := range sentEmails {
		if strings.Contains(sent.body, "listed as the Model Lead") {
			suite.ElementsMatch([]string{leadEmail}, sent.bcc)
		} else {
			suite.ElementsMatch([]string{nonLeadEmail.Email}, sent.bcc)
			suite.NotContains(sent.bcc, optedOutEmail.Email)
		}
	}
}

func (suite *ResolverSuite) TestUpdatePlanTaskStateToDoSendsNewAvailableInAppNotification() {
	plan := suite.createModelPlan("Plan For New Task Available In-App")
	suite.createPlanCollaborator(plan, "NTAI", []models.TeamRole{models.TeamRoleLeadership})
	suite.createPlanCollaborator(plan, "NTAX", []models.TeamRole{models.TeamRoleLeadership})
	optedInPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "NTAI")
	optedOutPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "NTAX")

	_, err := UserNotificationPreferencesUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		optedInPrincipal,
		suite.testConfigs.Store,
		map[string]interface{}{
			"newTaskAdded": models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		},
	)
	suite.NoError(err)

	_, err = updatePlanTaskStateByKey(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyModelPlan,
		models.PlanTaskStateComplete,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	leadBefore := suite.numUnreadNotifications(suite.testConfigs.Principal)
	optedInBefore := suite.numUnreadNotifications(optedInPrincipal)
	optedOutBefore := suite.numUnreadNotifications(optedOutPrincipal)

	_, err = updatePlanTaskStateByKey(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		plan.ID,
		models.PlanTaskKeyModelPlan,
		models.PlanTaskStateToDo,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	suite.Equal(leadBefore+1, suite.numUnreadNotifications(suite.testConfigs.Principal))
	suite.Equal(optedInBefore+1, suite.numUnreadNotifications(optedInPrincipal))
	suite.Equal(optedOutBefore, suite.numUnreadNotifications(optedOutPrincipal))
}

func (suite *ResolverSuite) TestTrySendPlanTaskCompletedNotificationsEmailRecipients() {
	plan := suite.createModelPlan("Plan For Task Completed Email Recipients")
	optedInCollaborator := suite.createPlanCollaborator(plan, "TCEM", []models.TeamRole{models.TeamRoleLeadership})
	optedOutCollaborator := suite.createPlanCollaborator(plan, "TCNO", []models.TeamRole{models.TeamRoleLeadership})
	optedInPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "TCEM")

	_, err := UserNotificationPreferencesUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		optedInPrincipal,
		suite.testConfigs.Store,
		map[string]interface{}{
			"taskCompleted": models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceEmail},
		},
	)
	suite.NoError(err)

	mockController := gomock.NewController(suite.T())
	defer mockController.Finish()
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailService.EXPECT().GetConfig().Return(&oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}).AnyTimes()

	type sentEmail struct {
		body string
		bcc  []string
	}
	var (
		mu         sync.Mutex
		wg         sync.WaitGroup
		sentEmails []sentEmail
	)
	wg.Add(2)
	mockEmailService.EXPECT().
		Send(
			gomock.Eq("unit-test-execution@mint.cms.gov"),
			gomock.Eq([]string{}),
			gomock.Nil(),
			gomock.Any(),
			gomock.Eq("text/html"),
			gomock.Any(),
			gomock.Any(),
		).
		DoAndReturn(func(_ string, _, _ []string, _, _ string, body string, opts ...oddmail.EmailOption) error {
			var emailOptions oddmail.EmailOptions
			for _, opt := range opts {
				opt(&emailOptions)
			}

			mu.Lock()
			sentEmails = append(sentEmails, sentEmail{
				body: body,
				bcc:  emailOptions.BccAddresses,
			})
			mu.Unlock()
			wg.Done()
			return nil
		}).
		Times(2)

	trySendPlanTaskCompletedNotifications(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		plan.ID,
		suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyModelPlan),
		suite.testConfigs.Principal,
		mockEmailService,
		email.AddressBook{DefaultSender: "unit-test-execution@mint.cms.gov"},
	)

	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(2 * time.Second):
		suite.FailNow("timed out waiting for task completed emails to send")
	}

	suite.Len(sentEmails, 2)

	leadEmail := suite.testConfigs.Principal.Account().Email
	nonLeadEmail, err := optedInCollaborator.UserAccount(suite.testConfigs.Context)
	suite.NoError(err)
	optedOutEmail, err := optedOutCollaborator.UserAccount(suite.testConfigs.Context)
	suite.NoError(err)

	for _, sent := range sentEmails {
		if strings.Contains(sent.body, "listed as the Model Lead") {
			suite.ElementsMatch([]string{leadEmail}, sent.bcc)
		} else {
			suite.ElementsMatch([]string{nonLeadEmail.Email}, sent.bcc)
			suite.NotContains(sent.bcc, optedOutEmail.Email)
		}
	}
}

func (suite *ResolverSuite) TestTrySendPlanTaskCompletedNotificationsInAppRecipients() {
	plan := suite.createModelPlan("Plan For Task Completed In-App Recipients")
	suite.createPlanCollaborator(plan, "TCIA", []models.TeamRole{models.TeamRoleLeadership})
	suite.createPlanCollaborator(plan, "TCIX", []models.TeamRole{models.TeamRoleLeadership})
	optedInPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "TCIA")
	optedOutPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "TCIX")

	_, err := UserNotificationPreferencesUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		optedInPrincipal,
		suite.testConfigs.Store,
		map[string]interface{}{
			"taskCompleted": models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		},
	)
	suite.NoError(err)

	leadBefore := suite.numUnreadNotifications(suite.testConfigs.Principal)
	optedInBefore := suite.numUnreadNotifications(optedInPrincipal)
	optedOutBefore := suite.numUnreadNotifications(optedOutPrincipal)

	trySendPlanTaskCompletedNotifications(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		plan.ID,
		suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyModelPlan),
		suite.testConfigs.Principal,
		nil,
		email.AddressBook{},
	)

	suite.Equal(leadBefore+1, suite.numUnreadNotifications(suite.testConfigs.Principal))
	suite.Equal(optedInBefore+1, suite.numUnreadNotifications(optedInPrincipal))
	suite.Equal(optedOutBefore, suite.numUnreadNotifications(optedOutPrincipal))
}

func (suite *ResolverSuite) numUnreadNotifications(principal *authentication.ApplicationPrincipal) int {
	userNotifications, err := notifications.UserNotificationCollectionGetByUser(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		principal,
	)
	suite.NoError(err)
	return userNotifications.NumUnreadNotifications()
}

func (suite *ResolverSuite) TestPlanTaskCompletedByUserAccountResolver() {
	// When CompletedBy is not set, the embedded completedByRelation method (auto-bound by
	// gqlgen, see plan_task.graphql) should return nil without error
	task := models.NewPlanTask(
		uuid.New(),
		uuid.New(),
		models.PlanTaskKeyModelPlan,
		models.PlanTaskStateToDo,
	)

	account, err := task.CompletedByUserAccount(suite.testConfigs.Context)
	suite.NoError(err)
	suite.Nil(account)
}
