package resolvers

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
