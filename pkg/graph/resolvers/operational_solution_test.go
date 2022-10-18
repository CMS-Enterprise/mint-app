package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestOperationaSolutionsGetByOPNeedID() {
}

func (suite *ResolverSuite) TestOperationalSolutionInsertOrUpdate() {
	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKAcquireALearnCont
	solType := models.OpSKOutlookMailbox

	need := suite.createOperationalNeed(plan, &needType, nil, true)

	changes := map[string]interface{}{}

	sol, err := OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	//TODO check fields

	suite.NotNil(sol)

}

func (suite *ResolverSuite) TestOperationalSolutionInsertOrUpdateCustom() {

}
