package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) createModelPlanWithNeedAndOpSol(
	needType models.OperationalNeedKey,
	solType models.OperationalSolutionKey,
) *models.ModelPlan {
	plan := suite.createModelPlan("plan for solutions")

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(
		suite.testConfigs.Logger,
		plan.ID,
		needType,
	)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["needed"] = true

	_, _ = OperationalSolutionCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		need.ID,
		&solType,
		changes,
		suite.testConfigs.Principal,
	)

	return plan
}

// TestModelPlanGetByOperationalSolutionKey is the test function for ModelPlanGetByOperationalSolutionKey
func (suite *ResolverSuite) TestModelPlanGetByOperationalSolutionKey() {
	needType := models.OpNKManageCd
	solType := models.OpSKMarx

	plan := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(plan.ID, modelPlanAndOpSols[0].ModelPlan.ID)
	suite.EqualValues(26, *modelPlanAndOpSols[0].OperationalSolution.SolutionType) // 26 is the value of OpSKMarx
}

// TestModelPlanWithoutOperationalSolution checks if a model plan without a valid operational solution is not fetched
func (suite *ResolverSuite) TestModelPlanWithoutOperationalSolution() {
	plan := suite.createModelPlan("plan without solutions")
	needType := models.OpNKManageCd
	solType := models.OpSKMarx

	// Creating a need without a solution
	_, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(
		suite.testConfigs.Logger,
		plan.ID,
		needType,
	)
	suite.NoError(err)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	suite.NoError(err)
	suite.Empty(modelPlanAndOpSols)
}

// TestMultipleModelPlansWithSameSolutionType checks if multiple model plans with the same solution type are fetched
func (suite *ResolverSuite) TestMultipleModelPlansWithSameSolutionType() {
	needType := models.OpNKManageCd
	solType := models.OpSKMarx

	_ = suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)
	_ = suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 2)
	suite.EqualValues(26, *modelPlanAndOpSols[0].OperationalSolution.SolutionType) // 26 is the value of OpSKMarx
	suite.EqualValues(26, *modelPlanAndOpSols[1].OperationalSolution.SolutionType) // 26 is the value of OpSKMarx

}

// TestMultipleModelPlansWithDifferentSolutionTypes checks if only the matching solution type is fetched
func (suite *ResolverSuite) TestMultipleModelPlansWithDifferentSolutionTypes() {
	needType := models.OpNKManageCd
	solType1 := models.OpSKMarx
	solType2 := models.OpSKCcw

	suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType1,
	)
	suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType2,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType1,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(26, *modelPlanAndOpSols[0].OperationalSolution.SolutionType) // 26 is the value of OpSKMarx

	modelPlanAndOpSols, err = suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType2,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(5, *modelPlanAndOpSols[0].OperationalSolution.SolutionType) // 5 is the value of OpSKCcw
}
