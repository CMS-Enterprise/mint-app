package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) createModelPlanWithNeedAndOpSol(
	needType models.OperationalNeedKey,
	solType models.OperationalSolutionKey,
) (*models.ModelPlan, *models.OperationalSolution) {
	plan := suite.createModelPlan("plan for solutions")

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(
		suite.testConfigs.Logger,
		plan.ID,
		needType,
	)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["needed"] = true

	opSol, err := OperationalSolutionCreate(
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
	suite.NoError(err)

	return plan, opSol
}

// TestModelPlanGetByOperationalSolutionKey is the test function for ModelPlanGetByOperationalSolutionKey
func (suite *ResolverSuite) TestModelPlanGetByOperationalSolutionKey() {
	needType := models.OpNKManageCd
	solType := models.OpSKMarx

	plan, opSol := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(plan.ID, modelPlanAndOpSols[0].ModelPlanID)
	suite.EqualValues(opSol.ID, modelPlanAndOpSols[0].OperationalSolutionID)
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

	mpA, opSolA := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)

	mpB, opSolB := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solType,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solType,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 2)
	suite.EqualValues(mpA.ID, modelPlanAndOpSols[1].ModelPlanID)
	suite.EqualValues(opSolA.ID, modelPlanAndOpSols[1].OperationalSolutionID)
	suite.EqualValues(mpB.ID, modelPlanAndOpSols[0].ModelPlanID)
	suite.EqualValues(opSolB.ID, modelPlanAndOpSols[0].OperationalSolutionID)
}

// TestMultipleModelPlansWithDifferentSolutionTypes checks if only the matching solution type is fetched
func (suite *ResolverSuite) TestMultipleModelPlansWithDifferentSolutionTypes() {
	needType := models.OpNKManageCd
	solTypeA := models.OpSKMarx
	solTypeB := models.OpSKCcw

	mpA, opSolA := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solTypeA,
	)

	mpB, opSolB := suite.createModelPlanWithNeedAndOpSol(
		needType,
		solTypeB,
	)

	modelPlanAndOpSols, err := suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solTypeA,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(mpA.ID, modelPlanAndOpSols[0].ModelPlanID)
	suite.EqualValues(opSolA.ID, modelPlanAndOpSols[0].OperationalSolutionID)

	modelPlanAndOpSols, err = suite.testConfigs.Store.ModelPlanGetByOperationalSolutionKey(
		suite.testConfigs.Logger,
		solTypeB,
	)
	suite.NoError(err)
	suite.Len(modelPlanAndOpSols, 1)
	suite.EqualValues(mpB.ID, modelPlanAndOpSols[0].ModelPlanID)
	suite.EqualValues(opSolB.ID, modelPlanAndOpSols[0].OperationalSolutionID)
}
