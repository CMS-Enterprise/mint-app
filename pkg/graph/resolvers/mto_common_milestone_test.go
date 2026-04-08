package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *ResolverSuite) TestArchiveMTOCommonMilestone() {
	commonMilestone := suite.getMTOCommonMilestoneByName("Manage Part C/D enrollment")
	if suite.NotNil(commonMilestone) {
		suite.False(commonMilestone.IsArchived)

		archivedMilestone, err := ArchiveMTOCommonMilestone(
			suite.testConfigs.Logger,
			suite.testConfigs.Store,
			commonMilestone.ID,
			suite.testConfigs.Principal.UserAccount.ID,
		)
		suite.NoError(err)
		if suite.NotNil(archivedMilestone) {
			suite.Equal(commonMilestone.ID, archivedMilestone.ID)
			suite.True(archivedMilestone.IsArchived)
		}

		reloaded, err := storage.MTOCommonMilestoneGetByIDLoader(
			suite.testConfigs.Store,
			suite.testConfigs.Logger,
			[]uuid.UUID{commonMilestone.ID},
		)
		suite.NoError(err)
		if suite.Len(reloaded, 1) {
			suite.True(reloaded[0].IsArchived)
		}
	}
}
