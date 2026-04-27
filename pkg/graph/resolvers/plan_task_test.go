package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPlanTaskStateResolver() {
	r := &planTaskResolver{&Resolver{}}

	// nil object should safely default to TO_DO
	state, err := r.State(suite.testConfigs.Context, nil)
	suite.NoError(err)
	suite.Equal(model.PlanTaskStateToDo, state)

	// Non-complete status should map to TO_DO state
	taskInProgress := &models.PlanTask{Status: models.PlanTaskStatusInProgress}
	state, err = r.State(suite.testConfigs.Context, taskInProgress)
	suite.NoError(err)
	suite.Equal(model.PlanTaskStateToDo, state)

	// COMPLETE status should map to COMPLETE state
	taskComplete := &models.PlanTask{Status: models.PlanTaskStatusComplete}
	state, err = r.State(suite.testConfigs.Context, taskComplete)
	suite.NoError(err)
	suite.Equal(model.PlanTaskStateComplete, state)
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

func (suite *ResolverSuite) TestModelPlanCreateCreatesThreeTasks() {
	plan := suite.createModelPlan("Plan With Default Tasks")

	tasks, err := PlanTaskGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(tasks, 3)

	taskByKey := planTasksByKey(tasks)
	suite.NotNil(taskByKey[models.PlanTaskKeyModelPlan])
	suite.NotNil(taskByKey[models.PlanTaskKeyMto])
	suite.NotNil(taskByKey[models.PlanTaskKeyDataExchange])

	for _, t := range tasks {
		suite.Equal(plan.ID, t.ModelPlanID)
		suite.Equal(models.PlanTaskStatusToDo, t.Status)
		suite.Nil(t.CompletedBy)
		suite.Nil(t.CompletedDts)
	}
}

func (suite *ResolverSuite) TestPlanTaskStatusTransitions() {
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
		suite.Equal(models.PlanTaskStatusInProgress, task.Status)
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
		suite.Equal(models.PlanTaskStatusInProgress, mtoTask.Status)
		suite.Equal(models.PlanTaskStatusToDo, dataExchangeTask.Status)
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
		suite.Equal(models.PlanTaskStatusInProgress, mtoTask.Status)
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
		suite.Equal(models.PlanTaskStatusInProgress, mtoTask.Status)
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
		suite.Equal(models.PlanTaskStatusInProgress, mtoTask.Status)
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
		suite.Equal(models.PlanTaskStatusInProgress, mtoTask.Status)

		err = MTOCategoryDelete(
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			category.ID,
		)
		suite.NoError(err)

		mtoTask = suite.getPlanTaskByKey(planForMTODeleteRegression.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStatusToDo, mtoTask.Status)
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
		suite.Equal(models.PlanTaskStatusInProgress, dataExchangeTask.Status)
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
		suite.Equal(models.PlanTaskStatusComplete, task.Status)
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
		suite.Equal(models.PlanTaskStatusInProgress, task.Status)
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
			suite.testConfigs.Logger,
			planForDEACleared.ID,
			map[string]interface{}{"status": models.ModelStatusCleared},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
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
		suite.Equal(models.PlanTaskStatusComplete, task.Status)
		suite.NotNil(task.CompletedBy)
		suite.NotNil(task.CompletedDts)
	})

	suite.Run("status transitions on model plan update set appropriate tasks COMPLETE", func() {
		// When model status changes to CLEARED: MODEL_PLAN and DATA_EXCHANGE tasks COMPLETE
		_, err := ModelPlanUpdate(
			suite.testConfigs.Logger,
			plan.ID,
			map[string]interface{}{"status": models.ModelStatusCleared},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		modelPlanTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyModelPlan)
		dataExchangeTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStatusComplete, modelPlanTask.Status)
		suite.NotNil(modelPlanTask.CompletedBy)
		suite.NotNil(modelPlanTask.CompletedDts)
		suite.Equal(models.PlanTaskStatusComplete, dataExchangeTask.Status)
		suite.NotNil(dataExchangeTask.CompletedBy)
		suite.NotNil(dataExchangeTask.CompletedDts)

		// When model status regresses from CLEARED to an earlier status:
		// MODEL_PLAN should return to IN_PROGRESS, while DATA_EXCHANGE remains COMPLETE if DEA is still COMPLETE.
		_, err = ModelPlanUpdate(
			suite.testConfigs.Logger,
			plan.ID,
			map[string]interface{}{"status": models.ModelStatusInternalCmmiClearance},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		modelPlanTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyModelPlan)
		dataExchangeTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStatusInProgress, modelPlanTask.Status)
		suite.Nil(modelPlanTask.CompletedBy)
		suite.Nil(modelPlanTask.CompletedDts)
		suite.Equal(models.PlanTaskStatusComplete, dataExchangeTask.Status)
		suite.NotNil(dataExchangeTask.CompletedBy)
		suite.NotNil(dataExchangeTask.CompletedDts)

		// When model status changes to ACTIVE: MTO task COMPLETE
		_, err = ModelPlanUpdate(
			suite.testConfigs.Logger,
			plan.ID,
			map[string]interface{}{"status": models.ModelStatusActive},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		mtoTask := suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStatusComplete, mtoTask.Status)
		suite.NotNil(mtoTask.CompletedBy)
		suite.NotNil(mtoTask.CompletedDts)

		// When model status regresses from ACTIVE to an earlier status:
		// MTO task should return to IN_PROGRESS if MTO data exists.
		_, err = ModelPlanUpdate(
			suite.testConfigs.Logger,
			plan.ID,
			map[string]interface{}{"status": models.ModelStatusAnnounced},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		mtoTask = suite.getPlanTaskByKey(plan.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStatusInProgress, mtoTask.Status)
		suite.Nil(mtoTask.CompletedBy)
		suite.Nil(mtoTask.CompletedDts)
	})

	suite.Run("regressing from ACTIVE returns MTO to TO_DO when no MTO data exists", func() {
		planWithoutMTOData := suite.createModelPlan("Plan For Active Regression Without MTO Data")

		_, err := ModelPlanUpdate(
			suite.testConfigs.Logger,
			planWithoutMTOData.ID,
			map[string]interface{}{"status": models.ModelStatusActive},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		_, err = ModelPlanUpdate(
			suite.testConfigs.Logger,
			planWithoutMTOData.ID,
			map[string]interface{}{"status": models.ModelStatusAnnounced},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		mtoTask := suite.getPlanTaskByKey(planWithoutMTOData.ID, models.PlanTaskKeyMto)
		suite.Equal(models.PlanTaskStatusToDo, mtoTask.Status)
		suite.Nil(mtoTask.CompletedBy)
		suite.Nil(mtoTask.CompletedDts)
	})

	suite.Run("regressing from CLEARED downgrades DATA_EXCHANGE when DEA is not COMPLETE", func() {
		planForRegression := suite.createModelPlan("Plan For DEA Regression")

		_, err := ModelPlanUpdate(
			suite.testConfigs.Logger,
			planForRegression.ID,
			map[string]interface{}{"status": models.ModelStatusCleared},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		_, err = ModelPlanUpdate(
			suite.testConfigs.Logger,
			planForRegression.ID,
			map[string]interface{}{"status": models.ModelStatusInternalCmmiClearance},
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
		)
		suite.NoError(err)

		modelPlanTask := suite.getPlanTaskByKey(planForRegression.ID, models.PlanTaskKeyModelPlan)
		dataExchangeTask := suite.getPlanTaskByKey(planForRegression.ID, models.PlanTaskKeyDataExchange)
		suite.Equal(models.PlanTaskStatusToDo, modelPlanTask.Status)
		suite.Nil(modelPlanTask.CompletedBy)
		suite.Nil(modelPlanTask.CompletedDts)
		suite.Equal(models.PlanTaskStatusToDo, dataExchangeTask.Status)
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

func (suite *ResolverSuite) TestPlanTaskCompletedByUserAccountResolver() {
	r := &planTaskResolver{&Resolver{}}

	// When CompletedBy is not set, resolver should return nil without error
	task := models.NewPlanTask(
		uuid.New(),
		uuid.New(),
		models.PlanTaskKeyModelPlan,
		models.PlanTaskStatusToDo,
	)

	account, err := r.CompletedByUserAccount(suite.testConfigs.Context, task)
	suite.NoError(err)
	suite.Nil(account)
}
