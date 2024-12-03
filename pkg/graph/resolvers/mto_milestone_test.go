package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/samber/lo"
)

func (suite *ResolverSuite) TestCreateMilestoneSolutionLinks() {
	plan := suite.createModelPlan("plan for testing MTO create milestone solution links")
	commonMilestoneKey := models.MTOCommonMilestoneKeyAppSupportCon

	// create a milestone
	_ = suite.createMilestoneCommon(plan.ID, commonMilestoneKey, []models.MTOCommonSolutionKey{
		models.MTOCSKCcw,
		models.MTOCSKApps,
	})

	// validate the created solutions
	solutions, err := storage.MTOCommonSolutionGetByCommonMilestoneKeyLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		[]models.MTOCommonMilestoneKey{commonMilestoneKey},
	)
	suite.NoError(err)

	// select the common solution keys from the common solutions using lo map
	commonSolutionKeys := lo.Map(solutions, func(s *models.MTOCommonSolution, index int) models.MTOCommonSolutionKey {
		return s.Key
	})

	// validate that the common solution keys are created
	suite.Len(commonSolutionKeys, 2)
	suite.Contains(commonSolutionKeys, models.MTOCSKCcw)
	suite.Contains(commonSolutionKeys, models.MTOCSKApps)

	// validate that the milestone links are created
	milestoneSolutionLinks, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		plan.ID,
	)

	suite.NoError(err)
	suite.Len(milestoneSolutionLinks, 2)
}
