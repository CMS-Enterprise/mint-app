package resolvers

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func (suite *ResolverSuite) TestMTOSolutionGetByMilestoneIDLOADER() {
	plan1 := suite.createModelPlan("model plan 1")
	commonMilestoneKey1 := models.MTOCommonMilestoneKeyAppSupportCon
	milestone1 := suite.createMilestoneCommon(plan1.ID, commonMilestoneKey1, []models.MTOCommonSolutionKey{
		models.MTOCSKCcw,
		models.MTOCSKApps,
	})

	commonMilestoneKey2 := models.MTOCommonMilestoneKeyCommWPart
	milestone2 := suite.createMilestoneCommon(plan1.ID, commonMilestoneKey2, []models.MTOCommonSolutionKey{
		models.MTOCSKCcw,
		models.MTOCSKApps,
	})
	commonMilestoneKey3 := models.MTOCommonMilestoneKeyAcquireALearnCont
	milestone3 := suite.createMilestoneCommon(plan1.ID, commonMilestoneKey3, []models.MTOCommonSolutionKey{
		models.MTOCSKBcda,
		models.MTOCSKCmsBox,
		models.MTOCSKCcw,
	})
	/***
	Validate the created solutions and assign them by key
	***/

	solutions, err := MTOSolutionGetByModelPlanIDLOADER(suite.testConfigs.Context, plan1.ID)
	suite.NoError(err)
	suite.Len(solutions, 4)

	solMTOCSKCcw, ok := lo.Find(solutions, func(solution *models.MTOSolution) bool {
		if solution.Key != nil {
			return *solution.Key == models.MTOCSKCcw
		}
		return false
	})
	suite.True(ok)
	solMTOCSKApps, ok := lo.Find(solutions, func(solution *models.MTOSolution) bool {
		if solution.Key != nil {
			return *solution.Key == models.MTOCSKApps
		}
		return false
	})
	suite.True(ok)
	solMTOCSKBcda, ok := lo.Find(solutions, func(solution *models.MTOSolution) bool {
		if solution.Key != nil {
			return *solution.Key == models.MTOCSKBcda
		}
		return false
	})
	suite.True(ok)
	solMTOCSKCmsBox, ok := lo.Find(solutions, func(solution *models.MTOSolution) bool {
		if solution.Key != nil {
			return *solution.Key == models.MTOCSKCmsBox
		}
		return false
	})
	suite.True(ok)
	/***
	end select solutions
	***/

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, []uuid.UUID]{
		{Key: milestone1.ID, Expected: []uuid.UUID{solMTOCSKCcw.ID, solMTOCSKApps.ID}},
		{Key: milestone2.ID, Expected: []uuid.UUID{solMTOCSKCcw.ID, solMTOCSKApps.ID}},
		{Key: milestone3.ID, Expected: []uuid.UUID{solMTOCSKCcw.ID, solMTOCSKBcda.ID, solMTOCSKCmsBox.ID}},
	}

	verifyFunc := func(data []*models.MTOSolution, expected []uuid.UUID) bool {
		// Map the IDs from the milestones, assert they match the expected returned result
		dataIDs := lo.Map(data, func(item *models.MTOSolution, _ int) uuid.UUID {
			return item.ID
		})
		return suite.ElementsMatch(dataIDs, expected)
	}
	// Call the helper method to validate all results
	loaders.VerifyLoaders[uuid.UUID, []*models.MTOSolution, []uuid.UUID](suite.testConfigs.Context, &suite.Suite, loaders.MTOSolution.ByMilestoneID,
		expectedResults, verifyFunc)
}

func (suite *ResolverSuite) TestCreateCommonSolutionAndLinkMilestones() {
	plan := suite.createModelPlan("Plan for testing CreateCommonSolutionAndLinkMilestones")
	// We'll make two new, existing milestones to link to
	// We'll just create them as custom milestones for simplicity here
	milestoneA, err := MTOMilestoneCreateCustom(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		"Milestone A",
		plan.ID,
		nil,
	)
	suite.NoError(err)

	milestoneB, err := MTOMilestoneCreateCustom(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		"Milestone B",
		plan.ID,
		nil,
	)
	suite.NoError(err)

	// Pick a known commonSolutionKey from your code; must exist in MTOCommonSolution
	commonSolutionKey := models.MTOCSKCcw

	// Now call the method we want to test: Create a common solution and link to these two milestones
	solution, err := MTOSolutionCreateCommon(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		plan.ID,
		commonSolutionKey,
		[]uuid.UUID{milestoneA.ID, milestoneB.ID}, // link these two milestones
	)
	suite.NoError(err)
	suite.NotNil(solution)
	suite.NotNil(solution.Key)
	suite.Equal(commonSolutionKey, *solution.Key, "Created solution should reference the correct common solution key")

	// Verify that the solution was created
	// We'll query by model plan to ensure we have exactly 1 solution for this plan
	solutions, err := MTOSolutionGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(solutions, 1, "We expect exactly one solution for this plan")

	// Verify that the solution is linked to both milestones
	for _, mID := range []uuid.UUID{milestoneA.ID, milestoneB.ID} {
		milestoneLinks, linkErr := storage.MTOMilestoneSolutionLinkGetByMilestoneID(
			suite.testConfigs.Store,
			suite.testConfigs.Logger,
			mID,
		)
		suite.NoError(linkErr)
		suite.Len(milestoneLinks, 1, "Each milestone should have exactly 1 solution linked")
		suite.Equal(solution.ID, milestoneLinks[0].SolutionID, "The solution linked should match the one we created")
	}

	// finally, delete the solution and ensure the links are removed (due to the `ON CASCADE DELETE`)
	err = MTOSolutionDelete(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, solution.ID)
	suite.NoError(err)
	milestonesAfterDelete, err := MTOMilestoneGetBySolutionIDLOADER(suite.testConfigs.Context, solution.ID)
	suite.NoError(err)
	suite.Len(milestonesAfterDelete, 0, "After deleting the solution, there should be no linked milestones")

}

func (suite *ResolverSuite) TestMTOSolutionUpdateLinkedMilestoness_AddByMilestoneID() {
	plan := suite.createModelPlan("plan for adding milestones by milestone ID")

	// Create a milestone with no linked solutions
	milestone, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Initial Milestone", plan.ID, nil)
	suite.NoError(err)

	// Create a custom solution
	solName := "Custom Solution 1"
	solType := models.MTOSolutionTypeOther
	sol, err := MTOSolutionCreateCustom(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		plan.ID,
		nil,
		solName,
		solType,
		nil,
		"POC Name",
		"poc@example.com",
	)
	suite.NoError(err)

	// Add the solution to the milestone by solution ID
	milestoneLinks := &model.MTOMilestoneLinks{
		MilestoneIDs: []uuid.UUID{milestone.ID},
	}

	_, err = MTOSolutionUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		sol.ID,
		map[string]interface{}{},
		milestoneLinks,
	)
	suite.NoError(err)

	// Verify the solution is linked now
	linkedSolutions, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(suite.testConfigs.Store, suite.testConfigs.Logger, milestone.ID)
	suite.NoError(err)
	suite.Len(linkedSolutions, 1)
	suite.Equal(sol.ID, linkedSolutions[0].SolutionID)
}
