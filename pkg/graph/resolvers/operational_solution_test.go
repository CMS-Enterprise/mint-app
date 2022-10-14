package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (suite *ResolverSuite) TestOperationalSolutionCollectionGetByOperationalNeedID() {
}

func (suite *ResolverSuite) TestOperationaSolutionsGetByOPNeed() {
}

func (suite *ResolverSuite) TestOperationalSolutionInsertOrUpdate() {
	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKAcquireALearnCont
	solType := models.OpSKOutlookMailbox
	need := suite.createOperationalNeed(plan, &needType, nil, true)
	sol := suite.createOperationalSolution(need, &solType, nil, true) //TODO update this

	suite.NotNil(sol)

}

func (suite *ResolverSuite) TestOperationalSolutionInsertOrUpdateCustom() {

}
