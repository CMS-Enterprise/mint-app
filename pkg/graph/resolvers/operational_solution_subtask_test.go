package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestOperationalSolutionSubtaskCreateSingle() {
	_ = suite.createOperationalSolutionSubtask()
}

func (suite *ResolverSuite) TestOperationalSolutionSubtaskCreateMultiple() {
	_ = suite.createOperationalSolutionSubtask()
}

func (suite *ResolverSuite) TestOperationalSolutionSubtasksUpdateByID() {
	subtasks := suite.createMultipleOperationSolutionSubtasks()
	updateInputs := suite.convertOperationalSubtasksToUpdateInputs(subtasks)

	changedNameA := "Changed A"
	changedNameB := "Changed B"

	updateInputs[0].Changes["name"] = changedNameA
	updateInputs[1].Changes["name"] = changedNameB

	results, err := OperationalSolutionSubtasksUpdateByID(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		updateInputs,
	)

	suite.NoError(err)
	suite.NotNil(results)
	suite.Len(results, len(subtasks))
	suite.EqualValues(results[0].Name, changedNameA)
	suite.EqualValues(results[1].Name, changedNameB)
}

func (suite *ResolverSuite) TestOperationalSolutionSubtaskGetByID() {
	subtask := suite.createOperationalSolutionSubtask()

	result, err := OperationalSolutionSubtaskGetByID(suite.testConfigs.Logger, suite.testConfigs.Store, subtask.ID)
	suite.NoError(err)
	suite.Equal(result, subtask)
}

func (suite *ResolverSuite) TestOperationalSolutionSubtaskGetBySolutionID() {
	solution := suite.createOperationalSolution()
	subtask := suite.createOperationalSolutionSubtaskWithSolution(solution)

	result, err := OperationalSolutionSubtasksGetBySolutionID(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		solution.ID,
	)
	suite.NoError(err)
	suite.Equal(result[0], subtask)
}

func (suite *ResolverSuite) TestOperationalSolutionSubtaskDelete() {
	subtask := suite.createOperationalSolutionSubtask()

	numDeletedRows, err := OperationalSolutionSubtaskDelete(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		subtask.ID,
	)
	suite.NoError(err)
	suite.EqualValues(numDeletedRows, 1)
}

func (suite *ResolverSuite) TestOperationalSolutionSubtaskDataLoader() {
	needType := models.OpNKManageCd
	plan := suite.createModelPlan("Plan For OpSolS 1")
	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)
	sol1, _ := OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, "AnotherSolution", nil, suite.testConfigs.Principal, suite.testConfigs.Store)

	sol2, _ := OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, "AnotherSolution Again", nil, suite.testConfigs.Principal, suite.testConfigs.Store)

	inputs := []*model.CreateOperationalSolutionSubtaskInput{{
		Name:   "Test Operational Solution Input 1",
		Status: models.OperationalSolutionSubtaskStatusTodo,
	},
		{
			Name:   "Test Operational Solution Input 2",
			Status: models.OperationalSolutionSubtaskStatusDone,
		}}
	_, err = OperationalSolutionSubtasksCreate(suite.testConfigs.Logger, suite.testConfigs.Store, inputs, sol1.ID, suite.testConfigs.Principal) // Create Subtasks for sol1
	suite.NoError(err)
	_, err = OperationalSolutionSubtasksCreate(suite.testConfigs.Logger, suite.testConfigs.Store, inputs, sol2.ID, suite.testConfigs.Principal) // Create Subtasks for sol2
	suite.NoError(err)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyOperationalSolutionSubtaskLoader(ctx, sol1.ID)
	})
	g.Go(func() error {
		return verifyOperationalSolutionSubtaskLoader(ctx, sol2.ID)
	})
	errG := g.Wait()
	suite.NoError(errG)

}
func verifyOperationalSolutionSubtaskLoader(ctx context.Context, solutionID uuid.UUID) error {

	OpSolS, err := OperationalSolutionSubtaskGetByModelPlanIDLOADER(ctx, solutionID)
	if err != nil {
		return err
	}

	if solutionID != OpSolS[0].SolutionID {
		return fmt.Errorf("operational Solution Subtask returned solution ID %s, expected %s", OpSolS[0].SolutionID, solutionID)
	}
	return nil
}
