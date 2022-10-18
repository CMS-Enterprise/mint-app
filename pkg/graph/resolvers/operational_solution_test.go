package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestOperationaSolutionsGetByOPNeedID() {

	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKAcquireALearnCont
	solType := models.OpSKOutlookMailbox

	need := suite.createOperationalNeed(plan, &needType, nil, true)
	_, _ = OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, nil, suite.testConfigs.Principal, suite.testConfigs.Store)
	_, _ = OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, "AnotherSolution", nil, suite.testConfigs.Principal, suite.testConfigs.Store)
	_, _ = OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, "AnotherSolution Again", nil, suite.testConfigs.Principal, suite.testConfigs.Store)
	//TODO validate we get the possible data as expected

}

func (suite *ResolverSuite) TestOperationalSolutionInsertOrUpdate() {
	// 1. Create solution, ensure fields are as expected
	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKAcquireALearnCont
	solType := models.OpSKOutlookMailbox

	need := suite.createOperationalNeed(plan, &needType, nil, true)

	changes := map[string]interface{}{}
	defStatus := models.OpSNotStarted

	sol, err := OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(sol)

	//nil fields
	suite.Nil(sol.NameOther)
	suite.Nil(sol.PocName)
	suite.Nil(sol.PocEmail)
	suite.Nil(sol.MustStartDts)
	suite.Nil(sol.MustFinishDts)
	suite.Nil(sol.ModifiedBy)
	suite.Nil(sol.ModifiedDts)

	suite.NotNil(sol.OperationalNeedID)

	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.NotNil(sol.CreatedDts)
	suite.NotNil(sol.Name)
	suite.EqualValues(sol.Archived, false)
	suite.EqualValues(sol.Key, &solType)
	suite.EqualValues(sol.Status, defStatus)

	//2. Update fields
	inProg := models.OpSInProgress
	pocName := "Tester Name"
	pocEmail := "tester@email.com"
	mustStartDts := time.Now()
	mustFinishDts := time.Now()
	changes["archived"] = true
	changes["pocName"] = pocName
	changes["pocEmail"] = pocEmail
	changes["mustStartDts"] = mustStartDts
	changes["mustFinishDts"] = mustFinishDts
	changes["status"] = inProg

	sol, err = OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	//modified fields correct
	suite.NotNil(sol.ModifiedDts)
	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.EqualValues(sol.ModifiedBy, &suite.testConfigs.Principal.EUAID)

	//update correct
	suite.EqualValues(sol.Archived, true)
	suite.EqualValues(sol.PocName, &pocName)
	suite.EqualValues(sol.PocEmail, &pocEmail)
	suite.EqualValues(sol.MustStartDts.UTC(), mustStartDts.UTC())
	suite.EqualValues(sol.MustFinishDts.UTC(), mustFinishDts.UTC())
	suite.EqualValues(sol.Status, inProg)

}

func (suite *ResolverSuite) TestOperationalSolutionInsertOrUpdateCustom() {

	// 1. Create solution, ensure fields are as expected
	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKAcquireALearnCont
	solTypeCustom := "A Unit test to test operational solutions"

	need := suite.createOperationalNeed(plan, &needType, nil, true)

	changes := map[string]interface{}{}
	defStatus := models.OpSNotStarted

	sol, err := OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, solTypeCustom, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(sol)

	//nil fields
	suite.Nil(sol.PocName)
	suite.Nil(sol.PocEmail)
	suite.Nil(sol.MustStartDts)
	suite.Nil(sol.MustFinishDts)
	suite.Nil(sol.ModifiedBy)
	suite.Nil(sol.ModifiedDts)
	suite.Nil(sol.Key) //Custom, so no name or key
	suite.Nil(sol.Name)

	suite.NotNil(sol.OperationalNeedID)

	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.EqualValues(sol.NameOther, &solTypeCustom)
	suite.NotNil(sol.CreatedDts)

	suite.EqualValues(sol.Archived, false)

	suite.EqualValues(sol.Status, defStatus)

	//2. Update fields
	inProg := models.OpSInProgress
	pocName := "Tester Name"
	pocEmail := "tester@email.com"
	mustStartDts := time.Now()
	mustFinishDts := time.Now()
	changes["archived"] = true
	changes["pocName"] = pocName
	changes["pocEmail"] = pocEmail
	changes["mustStartDts"] = mustStartDts
	changes["mustFinishDts"] = mustFinishDts
	changes["status"] = inProg

	sol, err = OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, solTypeCustom, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	//modified fields correct
	suite.NotNil(sol.ModifiedDts)
	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.EUAID)
	suite.EqualValues(sol.ModifiedBy, &suite.testConfigs.Principal.EUAID)

	//update correct
	suite.EqualValues(sol.Archived, true)
	suite.EqualValues(sol.PocName, &pocName)
	suite.EqualValues(sol.PocEmail, &pocEmail)
	suite.EqualValues(sol.MustStartDts.UTC(), mustStartDts.UTC())
	suite.EqualValues(sol.MustFinishDts.UTC(), mustFinishDts.UTC())
	suite.EqualValues(sol.Status, inProg)

}
