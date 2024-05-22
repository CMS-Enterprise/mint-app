package translatedaudit

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

// CreateModelPlan creates a model plan using the store. It doesn't do this in a transaction, and doesn't make
// any other relevant tables like the resolver does. It is just for testing
func (suite *TAuditSuite) createModelPlan(planName string) *models.ModelPlan {
	// Changes: Would it be useful to make everything create on a trigger than resolver?
	planToCreate := models.NewModelPlan(suite.testConfigs.Principal.UserAccount.ID, planName)
	retMP, err := suite.testConfigs.Store.ModelPlanCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		planToCreate,
	)
	suite.NoError(err)
	return retMP
}

// createOperationalNeed creates an operational need using the store. It is just for testing
func (suite *TAuditSuite) createOperationalNeed(modelPlanID uuid.UUID, customNeedType string) *models.OperationalNeed {

	needToCreate := models.NewOperationalNeed(suite.testConfigs.Principal.UserAccount.ID, modelPlanID)

	retNeed, err := suite.testConfigs.Store.OperationalNeedInsertOrUpdateOther(suite.testConfigs.Logger, needToCreate, customNeedType)
	suite.NoError(err)
	return retNeed
}

// createOperationalNeed creates an operational need using the store. It is just for testing
func (suite *TAuditSuite) createOperationalSolution(operationalNeedID uuid.UUID, customSolution string) *models.OperationalSolution {

	solToCreate := models.NewOperationalSolution(suite.testConfigs.Principal.UserAccount.ID, operationalNeedID)
	solToCreate.NameOther = &customSolution

	retSol, err := suite.testConfigs.Store.OperationalSolutionInsert(suite.testConfigs.Logger, solToCreate, nil)
	suite.NoError(err)
	return retSol
}
