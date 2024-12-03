package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *ResolverSuite) TestCreateMilestoneSolutionLinks() {
	plan := suite.createModelPlan("plan for testing MTO create milestone solution links")
	commonMilestoneKey := models.MTOCommonMilestoneKeyAppSupportCon

	// create a milestone
	milestone := suite.createMilestoneCommon(plan.ID, commonMilestoneKey, []models.MTOCommonSolutionKey{
		models.MTOCSKCcw,
		models.MTOCSKApps,
	})

	// validate the created solutions
	solutions, err := MTOSolutionGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	var commonSolutionKeys []models.MTOCommonSolutionKey
	for _, solution := range solutions {
		if solution.Key != nil {
			commonSolutionKeys = append(commonSolutionKeys, *solution.Key)
		}
	}

	// validate that the common solution keys are created
	suite.Len(commonSolutionKeys, 2)
	suite.Contains(commonSolutionKeys, models.MTOCSKCcw)
	suite.Contains(commonSolutionKeys, models.MTOCSKApps)

	// validate that the milestone links are created
	milestoneSolutionLinks, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		milestone.ID,
	)

	suite.NoError(err)
	suite.Len(milestoneSolutionLinks, 2)
}
