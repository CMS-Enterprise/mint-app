package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestOperationaSolutionsGetByOPNeedID() {

	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKManageCd
	solType := models.OpSKOutlookMailbox

	// need := suite.createOperationalNeed(plan, &needType,  true)
	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)
	// _, _ = OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, nil, suite.testConfigs.Principal, suite.testConfigs.Store)
	changes := map[string]interface{}{
		"nameOther": "AnotherSolution",
	}
	_, _ = OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, nil, changes, suite.testConfigs.Principal)
	changes["nameOther"] = "AnotherSolution Again"
	_, _ = OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, nil, changes, suite.testConfigs.Principal)

	opSols, err := OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, need.ID, false)
	suite.NoError(err)
	suite.Len(opSols, 2)

	opSols, err = OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, need.ID, true)
	suite.NoError(err)
	suite.Len(opSols, 3) //We now have the possible need that is not needed

	//INSERt the possible and return only needed types, verify it still returns 3
	_, _ = OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, &solType, nil, suite.testConfigs.Principal)

	opSols, err = OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, need.ID, false)
	suite.NoError(err)
	suite.Len(opSols, 3) //We still have 3 solutions, because they are now all needed

	//2. Get possible solutions for a custom type
	need, _ = OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, "Testing custom need types", true, suite.testConfigs.Principal, suite.testConfigs.Store)
	changes["nameOther"] = "Yet AnotherSolution Again"
	_, _ = OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, nil, changes, suite.testConfigs.Principal)
	changes["nameOther"] = "Yet AnotherSolution Again"
	_, _ = OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, nil, changes, suite.testConfigs.Principal)

	opSols, err = OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, need.ID, false)
	suite.NoError(err)
	suite.Len(opSols, 2)

	// suite.Len(opSols.PossibleSolutions, 0) //There is only 1 possilbe solution right now for ManageCD.

}

func (suite *ResolverSuite) TestOperationalSolutionLoader() {

	numModels := 3
	opNeedIds := makeMulipleModelsAndReturnNeedIDs(suite, numModels)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)

	for _, opNeedID := range opNeedIds {
		theFunc := getSolutionLoaderVerificationFunction(ctx, opNeedID, verifySolutionsLoader)
		g.Go(theFunc)
	}

	err := g.Wait()
	suite.NoError(err)
}
func (suite *ResolverSuite) TestOperationalSolutionLoaderNotNeeded() {
	numModels := 1
	opNeedIds := makeMulipleModelsAndReturnNeedIDs(suite, numModels)

	opSols, err := OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, opNeedIds[0], false)
	suite.Len(opSols, 0) // Should be an empty array, because there are no solutions at this point

	suite.NoError(err)

}

func verifySolutionsLoader(ctx context.Context, operationalNeedID uuid.UUID) error { //TODO make this more robust, as we can't assert at this level
	opSols, err := OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(ctx, operationalNeedID, true)
	if err != nil {
		return err
	}
	if len(opSols) < 1 {
		return fmt.Errorf("no operational solutions returns for %s", operationalNeedID)
	}
	if operationalNeedID != opSols[0].OperationalNeedID {
		return fmt.Errorf("op needs returned operational need ID %s, expected %s", opSols[0].OperationalNeedID, operationalNeedID)
	}
	return nil
}

func getSolutionLoaderVerificationFunction(ctx context.Context, operationalNeedID uuid.UUID, verifySolutionsFunc func(ctx context.Context, operationalNeedID uuid.UUID) error) func() error {
	return func() error {
		return verifySolutionsFunc(ctx, operationalNeedID)
	}
}

func makeMulipleModelsAndReturnNeedIDs(suite *ResolverSuite, numModels int) []uuid.UUID {
	opNeedSlice := []uuid.UUID{}
	for i := 0; i < numModels; i++ {
		plan := suite.createModelPlan("Plan For Needs " + fmt.Sprint(i))
		needs, err := OperationalNeedCollectionGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
		suite.NoError(err)
		for j := 0; j < len(needs); j++ {
			opNeedSlice = append(opNeedSlice, needs[j].ID)
		}
	}
	return opNeedSlice

}
func (suite *ResolverSuite) TestOperationalSolutionIsCommonLogic() {

	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKManageCd
	solTypeCommon := models.OpSKMarx
	solTypeUnCommon := models.OpSKCrossModelContract

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["needed"] = false

	sol, err := OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, &solTypeCommon, changes, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.NotNil(sol)
	suite.True(*sol.IsCommonSolution)

	sol2, err := OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, &solTypeUnCommon, changes, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.NotNil(sol2)
	suite.False(*sol2.IsCommonSolution)

}
func (suite *ResolverSuite) TestOperationalSolutionInsertOrUpdate() {
	// 1. Create solution, ensure fields are as expected
	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKAcquireALearnCont
	solType := models.OpSKOutlookMailbox

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["needed"] = false
	defStatus := models.OpSNotStarted

	sol, err := OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, &solType, changes, suite.testConfigs.Principal)
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

	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Account().ID)
	suite.NotNil(sol.CreatedDts)
	suite.NotNil(sol.Name)
	suite.EqualValues(*sol.Needed, false)
	suite.EqualValues(sol.Key, &solType)
	suite.EqualValues(sol.Status, defStatus)

	//2. Update fields
	inProg := models.OpSInProgress
	pocName := "Tester Name"
	pocEmail := "tester@email.com"
	mustStartDts := time.Now()
	mustFinishDts := time.Now()
	changes["needed"] = true
	changes["pocName"] = pocName
	changes["pocEmail"] = pocEmail
	changes["mustStartDts"] = mustStartDts
	changes["mustFinishDts"] = mustFinishDts
	changes["status"] = inProg

	sol, err = OperationalSolutionUpdate(suite.testConfigs.Logger, sol.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	//modified fields correct
	suite.NotNil(sol.ModifiedDts)
	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Account().ID)
	suite.EqualValues(sol.ModifiedBy, &suite.testConfigs.Principal.Account().ID)

	//update correct
	suite.EqualValues(*sol.Needed, true)
	suite.EqualValues(sol.PocName, &pocName)
	suite.EqualValues(sol.PocEmail, &pocEmail)
	suite.WithinDuration(sol.MustStartDts.UTC(), mustStartDts.UTC(), 30*time.Second)
	suite.WithinDuration(sol.MustFinishDts.UTC(), mustFinishDts.UTC(), 30*time.Second)
	suite.EqualValues(sol.Status, inProg)

}

func (suite *ResolverSuite) TestOperationalSolutionInsertOrUpdateCustom() {

	// 1. Create solution, ensure fields are as expected
	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKAcquireALearnCont
	solTypeCustom := "A Unit test to test operational solutions"

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["nameOther"] = solTypeCustom
	defStatus := models.OpSNotStarted

	sol, err := OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, nil, changes, suite.testConfigs.Principal)
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

	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Account().ID)
	suite.EqualValues(sol.NameOther, &solTypeCustom)
	suite.NotNil(sol.CreatedDts)

	suite.EqualValues(*sol.Needed, true)

	suite.EqualValues(sol.Status, defStatus)

	//2. Update fields
	inProg := models.OpSInProgress
	pocName := "Tester Name"
	pocEmail := "tester@email.com"
	mustStartDts := time.Now()
	mustFinishDts := time.Now()
	changes["needed"] = true
	changes["pocName"] = pocName
	changes["pocEmail"] = pocEmail
	changes["mustStartDts"] = mustStartDts
	changes["mustFinishDts"] = mustFinishDts
	changes["status"] = inProg

	sol, err = OperationalSolutionUpdate(suite.testConfigs.Logger, sol.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	//modified fields correct
	suite.NotNil(sol.ModifiedDts)
	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Account().ID)
	suite.EqualValues(sol.ModifiedBy, &suite.testConfigs.Principal.Account().ID)

	//update correct
	suite.EqualValues(*sol.Needed, true)
	suite.EqualValues(sol.PocName, &pocName)
	suite.EqualValues(sol.PocEmail, &pocEmail)
	suite.WithinDuration(sol.MustStartDts.UTC(), mustStartDts.UTC(), 30*time.Second)
	suite.WithinDuration(sol.MustFinishDts.UTC(), mustFinishDts.UTC(), 30*time.Second)
	suite.EqualValues(sol.Status, inProg)

}

func (suite *ResolverSuite) TestOperationalSolutionCustomUpdateByID() {

	// 1. Create solution, and update by ID
	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKAcquireALearnCont
	solTypeCustom := "A Unit test to test operational solutions"

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["nameOther"] = solTypeCustom

	sol, err := OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, nil, changes, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.NotNil(sol)
	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Account().ID)

	newSolType := "A Modified unit test to test operational Solutions"
	changes["nameOther"] = newSolType

	sol2, err := OperationalSolutionUpdate(suite.testConfigs.Logger, sol.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	suite.EqualValues(sol2.NameOther, &newSolType)
	suite.EqualValues(sol2.ID, sol.ID)
	suite.NotNil(sol2.ModifiedDts)
	suite.EqualValues(sol2.CreatedBy, suite.testConfigs.Principal.Account().ID)
	suite.EqualValues(sol2.ModifiedBy, &suite.testConfigs.Principal.Account().ID)

	// 2. Fail update when set solution name to empty string, as it has a type
	changes["nameOther"] = ""
	_, err = OperationalSolutionUpdate(suite.testConfigs.Logger, sol.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)

}

func (suite *ResolverSuite) TestOperationaSolutionsGetByID() {

	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKManageCd
	solType := models.OpSKOutlookMailbox

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)

	sol, err := OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, &solType, nil, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.NotNil(sol)
	solGet, err := OperationalSolutionGetByID(suite.testConfigs.Logger, sol.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(solGet)
	suite.EqualValues(solGet.ID, sol.ID)

}

func (suite *ResolverSuite) TestGetSolutionSelectedDetails() {

	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKManageCd
	solType := models.OpSKInnovation

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)

	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	changes := map[string]interface{}{
		"performancePeriodStarts": "2020-05-13T20:47:50.12Z",
	}

	basics, err = UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	sol, err := OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, &solType, nil, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.NotNil(sol)
	solutionSelectedDetails, err := suite.testConfigs.Store.GetSolutionSelectedDetails(sol.ID)
	suite.NoError(err)

	suite.EqualValues(plan.Abbreviation, solutionSelectedDetails.ModelAbbreviation)
	suite.EqualValues(basics.PerformancePeriodStarts, solutionSelectedDetails.ModelStartDate)
	suite.EqualValues(plan.ModelName, solutionSelectedDetails.ModelName)
	suite.EqualValues(plan.Status, solutionSelectedDetails.ModelStatus)
	suite.EqualValues(sol.Status, solutionSelectedDetails.SolutionStatus)

}
