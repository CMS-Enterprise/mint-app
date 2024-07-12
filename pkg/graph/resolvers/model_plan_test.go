package resolvers

import (
	"bytes"
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/email"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

func (suite *ResolverSuite) TestModelPlanCreate() {
	planName := "Test Plan"
	result, err := ModelPlanCreate(
		context.Background(),
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		planName,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)

	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(planName, result.ModelName)
	suite.EqualValues(false, result.Archived)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, result.CreatedBy)
	suite.Nil(result.ModifiedBy)
	suite.Nil(result.ModifiedDts)
	suite.EqualValues(models.ModelStatusPlanDraft, result.Status)
}

func (suite *ResolverSuite) TestModelPlanUpdate() {
	plan := suite.createModelPlan("Test Plan")

	changes := map[string]interface{}{
		"modelName":    "NEW_AND_IMPROVED",
		"abbreviation": "some model abbreviation",
		"status":       models.ModelStatusIcipComplete,
		"archived":     true,
	}
	result, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store) // update plan with new user "UPDT"

	suite.NoError(err)
	suite.EqualValues(plan.ID, result.ID)
	suite.EqualValues(changes["modelName"], result.ModelName)
	suite.EqualValues(changes["archived"], result.Archived)

	suite.EqualValues(changes["status"], result.Status)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, result.CreatedBy)
	suite.NotNil(result.ModifiedBy)
	suite.NotNil(result.ModifiedDts)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestModelPlanGetByID() {
	plan := suite.createModelPlan("Test Plan")

	result, err := ModelPlanGetByID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(plan, result)
}

func (suite *ResolverSuite) TestModelPlanCollection() {
	// Create 3 plans without additional collaborators (TEST is the only one, by default)
	_ = suite.createModelPlan("Test Plan")
	_ = suite.createModelPlan("Test Plan 2")
	planWithCRTDLs := suite.createModelPlan("Test Plan with CRTDL")

	// Create a plan that has CLAB as a collaborator (along with TEST)
	planWithCollab := suite.createModelPlan("Test Plan 4 (Collab)")
	suite.createPlanCollaborator(planWithCollab, "CLAB", []models.TeamRole{models.TeamRoleEvaluation})

	suite.createPlanCR(planWithCRTDLs, "Happy Happy Test", time.Now(), time.Now().Add(time.Hour*48), "Good CR", "This is a test")
	suite.createPlanTDL(planWithCRTDLs, "Happy Happy Test", time.Now(), "Good TDL", "This is a test")

	// Get plan collection as CLAB
	clabPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "CLAB")
	clabPrincipal.JobCodeASSESSMENT = false

	// Assert that CLAB only sees 1 model plan with collab only filter
	result, err := ModelPlanCollection(suite.testConfigs.Logger, clabPrincipal, suite.testConfigs.Store, model.ModelPlanFilterCollabOnly)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 1)

	// Assert that CLAB sees all 4 model plans with include all filter
	result, err = ModelPlanCollection(suite.testConfigs.Logger, clabPrincipal, suite.testConfigs.Store, model.ModelPlanFilterIncludeAll)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 4)

	// Assert that TEST only sees all 4 model plans with collab only filter (as they're a collaborator on all of them)
	result, err = ModelPlanCollection(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, model.ModelPlanFilterCollabOnly)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 4)

	// Assert that TEST sees all 4 model plans with include all filter
	result, err = ModelPlanCollection(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, model.ModelPlanFilterIncludeAll)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 4)

	// Assert that TEST sees all 1 model plan when CRDTL is selected
	result, err = ModelPlanCollection(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, model.ModelPlanFilterWithCrTdls)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 1)
}

func (suite *ResolverSuite) TestModelPlanNameHistory() {

	modelNames := []string{"Plan For History0", "Plan For History1", "Plan For History2", "Plan For History3"}

	plan := suite.createModelPlan(modelNames[0])

	for i := 1; i < len(modelNames); i++ {
		changes := map[string]interface{}{
			"modelName": modelNames[i],
		}
		_, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
		suite.NoError(err)
	}

	historyAsc, err := ModelPlanNameHistory(suite.testConfigs.Logger, plan.ID, models.SortAsc, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(modelNames, historyAsc)

	//Reverse the order of the strings
	last := len(modelNames) - 1
	for i := 0; i < len(modelNames)/2; i++ {
		modelNames[i], modelNames[last-i] = modelNames[last-i], modelNames[i]
	}

	historyDesc, err := ModelPlanNameHistory(suite.testConfigs.Logger, plan.ID, models.SortDesc, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(modelNames, historyDesc)

}

func (suite *ResolverSuite) TestModelPlanDataLoader() {
	plan1 := suite.createModelPlan("Plan For Plan 1")
	plan2 := suite.createModelPlan("Plan For Plan 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyModelPlanLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyModelPlanLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}

func verifyModelPlanLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	plan, err := ModelPlanGetByIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != plan.ID {
		return fmt.Errorf("model Plan returned model plan ID %s, expected %s", plan.ID, modelPlanID)
	}
	return nil
}

func (suite *ResolverSuite) TestModelPlanOpSolutionLastModifiedDtsDataLoaderSimpleCreationDts() {
	plan := suite.createModelPlan("Plan For Plan 1")
	expectedDts := plan.CreatedDts

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyModelPlanOpSolutionLastModifiedDtsLoader(ctx, plan.ID, expectedDts)
	})
	err := g.Wait()
	suite.NoError(err)
}

func (suite *ResolverSuite) TestModelPlanOpSolutionLastModifiedDtsDataLoader() {
	dummyFileReader := bytes.NewReader([]byte("Some test file contents"))

	// Create a model plan
	plan := suite.createModelPlan("Plan with Documents")
	document, err := suite.createTestPlanDocument(plan, dummyFileReader)
	suite.NoError(err)

	operationalNeeds, err := OperationalNeedCollectionGetByModelPlanID(
		suite.testConfigs.Logger,
		plan.ID,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.GreaterOrEqual(len(operationalNeeds), 1)

	err = suite.verifyModelPlanTrackingDate(plan, operationalNeeds[0].CreatedDts)
	suite.NoError(err)

	// Create another model plan to create additional unrelated operational needs
	plan2 := suite.createModelPlan("Alternate Plan with Documents")
	_, err = suite.createTestPlanDocument(plan2, dummyFileReader)
	suite.NoError(err)

	// Confirm that the original plan's tracking date is unchanged
	err = suite.verifyModelPlanTrackingDate(plan, operationalNeeds[0].CreatedDts)
	suite.NoError(err)

	// Create an operational need for the plan
	needType := models.OpNKAcquireALearnCont
	solType := models.OpSKOutlookMailbox

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(
		suite.testConfigs.Logger,
		plan.ID,
		needType,
	)
	suite.NoError(err)

	changes := map[string]interface{}{}
	changes["needed"] = false

	// Create a solution for the plan
	sol, err := OperationalSolutionCreate(
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
	suite.NotNil(sol)

	err = suite.verifyModelPlanTrackingDate(plan, sol.CreatedDts)
	suite.NoError(err)

	// Create a subtask for the solution
	opSolSubtask := suite.createOperationalSolutionSubtaskWithSolution(sol)

	err = suite.verifyModelPlanTrackingDate(plan, opSolSubtask.CreatedDts)
	suite.NoError(err)

	documentSolLinks, err := PlanDocumentSolutionLinksCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		sol.ID,
		[]uuid.UUID{document.ID},
		suite.testConfigs.Principal,
	)
	suite.NoError(err)
	suite.Len(documentSolLinks, 1)

	err = suite.verifyModelPlanTrackingDate(plan, documentSolLinks[0].CreatedDts)
	suite.NoError(err)
}

func (suite *ResolverSuite) TestModelPlansGetByFavorited() {
	testPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "User B")
	plan := suite.createModelPlan("My Favorite Plan")
	_ = suite.createModelPlan("My Unfavorited Plan")

	_, err := PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		testPrincipal.UserAccount.ID,
		suite.testConfigs.Store,
		plan.ID,
	)
	suite.NoError(err)

	retPlans, err := suite.testConfigs.Store.ModelPlanCollectionFavorited(
		suite.testConfigs.Logger,
		false,
		testPrincipal.UserAccount.ID,
	)

	suite.NoError(err)
	suite.Len(retPlans, 1)
	suite.EqualValues(plan.ID, retPlans[0].ID)
}

func (suite *ResolverSuite) TestModelPlansGetByFavoritedWithMultipleFavorited() {
	plan1 := suite.createModelPlan("My Favorite Plan 1")
	plan2 := suite.createModelPlan("My Favorite Plan 2")

	_, err := PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan1.ID,
	)
	suite.NoError(err)

	_, err = PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan2.ID,
	)
	suite.NoError(err)

	retPlans, err := suite.testConfigs.Store.ModelPlanCollectionFavorited(
		suite.testConfigs.Logger,
		false,
		suite.testConfigs.Principal.Account().ID,
	)

	suite.NoError(err)
	suite.Len(retPlans, 2)
}

func (suite *ResolverSuite) TestModelPlansGetByFavoritedWithArchival() {
	plan := suite.createModelPlan("My Favorite Plan")
	archivedPlan := suite.createModelPlan("My Archived Favorite Plan")

	_, err := PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)
	suite.NoError(err)

	_, err = PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Principal.Account().ID,
		suite.testConfigs.Store,
		archivedPlan.ID,
	)
	suite.NoError(err)

	changes := map[string]interface{}{
		"archived": true,
	}
	_, err = ModelPlanUpdate(
		suite.testConfigs.Logger,
		archivedPlan.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)

	retPlans, err := suite.testConfigs.Store.ModelPlanCollectionFavorited(
		suite.testConfigs.Logger,
		false,
		suite.testConfigs.Principal.Account().ID,
	)

	suite.NoError(err)
	suite.Len(retPlans, 1)
	suite.EqualValues(plan.ID, retPlans[0].ID)
}

func (suite *ResolverSuite) verifyModelPlanTrackingDate(
	plan *models.ModelPlan,
	expectedDate time.Time,
) error {
	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyModelPlanOpSolutionLastModifiedDtsLoader(ctx, plan.ID, expectedDate)
	})
	return g.Wait()
}

func verifyModelPlanOpSolutionLastModifiedDtsLoader(ctx context.Context, modelPlanID uuid.UUID, expectedDts time.Time) error {

	dts, err := ModelPlanOpSolutionLastModifiedDtsGetByIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if dts == nil {
		return fmt.Errorf("model plan returned nil dts")
	}

	if !expectedDts.Equal(*dts) {
		return fmt.Errorf("model plan returned last modified dts %s, expected %s", dts, expectedDts)
	}
	return nil
}
