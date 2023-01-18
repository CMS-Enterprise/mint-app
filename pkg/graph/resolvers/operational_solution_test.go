package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

func (suite *ResolverSuite) TestOperationaSolutionsGetByOPNeedID() {

	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKManageCd
	solType := models.OpSKOutlookMailbox

	// need := suite.createOperationalNeed(plan, &needType,  true)
	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)
	// _, _ = OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, nil, suite.testConfigs.Principal, suite.testConfigs.Store)
	_, _ = OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, "AnotherSolution", nil, suite.testConfigs.Principal, suite.testConfigs.Store)
	_, _ = OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, "AnotherSolution Again", nil, suite.testConfigs.Principal, suite.testConfigs.Store)

	opSols, err := OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, need.ID, false)
	suite.NoError(err)
	suite.Len(opSols, 2)

	opSols, err = OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, need.ID, true)
	suite.NoError(err)
	suite.Len(opSols, 3) //We now have the possible need that is not needed

	//INSERt the possible and return only needed types, verify it still returns 3
	_, _ = OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, nil, suite.testConfigs.Principal, suite.testConfigs.Store)

	opSols, err = OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, need.ID, false)
	suite.NoError(err)
	suite.Len(opSols, 3) //We still have 3 solutions, because they are now all needed

	//2. Get possible solutions for a custom type
	need, _ = OperationalNeedInsertOrUpdateCustom(suite.testConfigs.Logger, plan.ID, "Testing custom need types", true, suite.testConfigs.Principal, suite.testConfigs.Store)
	_, _ = OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, "AnotherSolution", nil, suite.testConfigs.Principal, suite.testConfigs.Store)
	_, _ = OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, "AnotherSolution Again", nil, suite.testConfigs.Principal, suite.testConfigs.Store)

	opSols, err = OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(suite.testConfigs.Context, need.ID, false)
	suite.NoError(err)
	suite.Len(opSols, 2)

	// suite.Len(opSols.PossibleSolutions, 0) //There is only 1 possilbe solution right now for ManageCD.

}

func (suite *ResolverSuite) TestOperationalSolutionLoader() {
	plan1 := suite.createModelPlan("Plan For Needs 1")
	plan2 := suite.createModelPlan("Plan For Needs 2")

	needType := models.OpNKAcquireALearnCont

	need1, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan1.ID, needType)
	suite.NoError(err)
	suite.NotNil(need1)
	need2, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan2.ID, needType)
	suite.NoError(err)
	suite.NotNil(need2)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifySolutionsLoader(ctx, need1.ID)
	})
	g.Go(func() error {
		return verifySolutionsLoader(ctx, need2.ID)
	})
	err = g.Wait()
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

func verifySolutionsLoaderSimple(ctx context.Context, operationalNeedID uuid.UUID) error { //TODO make this more robust, as we can't assert at this level
	opSols, err := OperationaSolutionsAndPossibleGetByOPNeedIDLOADERSimple(ctx, operationalNeedID, true)
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

func verifySolutionsNoLoader(ctx context.Context, operationalNeedID uuid.UUID, store *storage.Store) error { //TODO make this more robust, as we can't assert at this level
	logger := appcontext.ZLogger(ctx)
	opSols, err := OperationaSolutionsAndPossibleGetByOPNeedID(logger, operationalNeedID, true, store)
	if err != nil {
		return err
	}
	if len(opSols) < 1 {
		return fmt.Errorf("no operational solutions returns for %s", operationalNeedID)
	}
	// if operationalNeedID != opSols[0].OperationalNeedID { // NOT TESTING THIS, because older SQL would return uuid.nil
	// 	return fmt.Errorf("op needs returned operational need ID %s, expected %s", opSols[0].OperationalNeedID, operationalNeedID)
	// }
	return nil
}

func getVerificationFunction(ctx context.Context, operationalNeedID uuid.UUID, verifySolutionsFunc func(ctx context.Context, operationalNeedID uuid.UUID) error) func() error {
	return func() error {
		return verifySolutionsFunc(ctx, operationalNeedID)
	}
}
func getVerificationFunctionStore(ctx context.Context, operationalNeedID uuid.UUID, store *storage.Store, verifySolutionsFunc func(ctx context.Context, operationalNeedID uuid.UUID, store *storage.Store) error) func() error {
	return func() error {
		return verifySolutionsFunc(ctx, operationalNeedID, store)
	}
}
func (suite *ResolverSuite) TestBenchmarkDataLoadersComparison() {
	numModels := 100
	opNeedIds := makeMulipleModelsAndReturnNeedIDs(suite, numModels)
	marshalledParams := opNeedsToMarshaledParams(opNeedIds)

	suite.Run("MappedDataLoader", func() {
		g, ctx := errgroup.WithContext(suite.testConfigs.Context)
		for _, opNeedID := range opNeedIds {
			theFunc := getVerificationFunction(ctx, opNeedID, verifySolutionsLoader)
			g.Go(theFunc)
		}
		err := g.Wait()
		suite.NoError(err)

	})

	suite.Run("SimpleDataLoader", func() {
		g, ctx := errgroup.WithContext(suite.testConfigs.Context)
		for _, opNeedID := range opNeedIds {
			theFunc := getVerificationFunction(ctx, opNeedID, verifySolutionsLoaderSimple)
			g.Go(theFunc)
		}
		err := g.Wait()
		suite.NoError(err)

	})

	suite.Run("No Data Loader", func() {
		g, ctx := errgroup.WithContext(suite.testConfigs.Context)
		for _, opNeedID := range opNeedIds {
			theFunc := getVerificationFunctionStore(ctx, opNeedID, suite.testConfigs.Store, verifySolutionsNoLoader)
			g.Go(theFunc)
		}
		err := g.Wait()
		suite.NoError(err)

	})

	suite.Run("Loader SQL with Map", func() {
		_, err := suite.testConfigs.Store.OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(suite.testConfigs.Logger, marshalledParams)
		suite.NoError(err)
	})
	suite.Run("Loader SQL Simplified", func() {
		_, err := suite.testConfigs.Store.OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADERSimplified(suite.testConfigs.Logger, marshalledParams)
		suite.NoError(err)
	})

	suite.T().Log("TestBenchmarkDataLoadersComparison Created ", numModels, " models. Num of Needs : ", len(opNeedIds))
}

func opNeedsToMarshaledParams(uuidSlice []uuid.UUID) string {
	// cKeys := []loaders.KeyArgs{}
	cKeys := loaders.KeyArgsArray{}
	includeNotNeeded := true
	for _, operationalNeedID := range uuidSlice {
		arg := loaders.KeyArgs{
			Args: map[string]interface{}{
				"include_not_needed":  includeNotNeeded,
				"operational_need_id": operationalNeedID,
			},
		}
		cKeys = append(cKeys, arg)
	}
	marshaledParams, _ := cKeys.ToJSONArray()
	return marshaledParams

}

// func (suite *ResolverSuite) TestBenchmarkDataLoaderSimple() {
// 	opNeedIds := make100ModelsAndReturnNeedIDs(suite)

// 	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
// 	for _, opNeedID := range opNeedIds {
// 		g.Go(func() error {
// 			return verifySolutionsLoaderSimple(ctx, opNeedID)
// 		})

// 	}

// 	err := g.Wait()
// 	suite.NoError(err)
// }
// func (suite *ResolverSuite) TestBenchmarkDataLoader() {
// 	opNeedIds := make100ModelsAndReturnNeedIDs(suite)

// 	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
// 	for _, opNeedID := range opNeedIds {
// 		g.Go(func() error {
// 			return verifySolutionsLoader(ctx, opNeedID)
// 		})

// 	}

// 	err := g.Wait()
// 	suite.NoError(err)
// }
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

	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Username)
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

	sol, err = OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	//modified fields correct
	suite.NotNil(sol.ModifiedDts)
	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Username)
	suite.EqualValues(sol.ModifiedBy, &suite.testConfigs.Principal.Username)

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

	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Username)
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

	sol, err = OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, solTypeCustom, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	//modified fields correct
	suite.NotNil(sol.ModifiedDts)
	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Username)
	suite.EqualValues(sol.ModifiedBy, &suite.testConfigs.Principal.Username)

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

	sol, err := OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, need.ID, solTypeCustom, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(sol)

	newSolType := "A Modified unit test to test operational Solutions"
	suite.EqualValues(sol.CreatedBy, suite.testConfigs.Principal.Username)

	sol2, err := OperationalSolutionCustomUpdateByID(suite.testConfigs.Logger, sol.ID, &newSolType, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	suite.EqualValues(sol2.NameOther, &newSolType)
	suite.EqualValues(sol2.ID, sol.ID)
	suite.NotNil(sol2.ModifiedDts)
	suite.EqualValues(sol2.CreatedBy, suite.testConfigs.Principal.Username)
	suite.EqualValues(sol2.ModifiedBy, &suite.testConfigs.Principal.Username)

	// 2. Fail update when set solution type to null
	_, err = OperationalSolutionCustomUpdateByID(suite.testConfigs.Logger, sol.ID, nil, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)

}

func (suite *ResolverSuite) TestOperationaSolutionsGetByID() {

	plan := suite.createModelPlan("plan for solutions")
	needType := models.OpNKManageCd
	solType := models.OpSKOutlookMailbox

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)
	sol, err := OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, need.ID, solType, nil, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(sol)
	solGet, err := OperationalSolutionGetByID(suite.testConfigs.Logger, sol.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(solGet)
	suite.EqualValues(solGet.ID, sol.ID)

}
