package resolvers

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

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
