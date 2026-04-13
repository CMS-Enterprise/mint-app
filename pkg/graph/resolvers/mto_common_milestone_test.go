package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *ResolverSuite) TestArchiveMTOCommonMilestone() {
	commonMilestone := suite.getMTOCommonMilestoneByName("Manage Part C/D enrollment")
	if suite.NotNil(commonMilestone) {
		actorUserID := suite.testConfigs.Principal.UserAccount.ID
		suite.Require().NoError(setTestMTOCommonMilestoneArchivedState(
			suite.testConfigs.Store,
			commonMilestone.ID,
			actorUserID,
			false,
		))
		commonMilestone.IsArchived = false
		suite.T().Cleanup(func() {
			suite.NoError(setTestMTOCommonMilestoneArchivedState(
				suite.testConfigs.Store,
				commonMilestone.ID,
				actorUserID,
				false,
			))
		})

		suite.False(commonMilestone.IsArchived)

		archivedMilestone, err := ArchiveMTOCommonMilestone(
			suite.testConfigs.Logger,
			suite.testConfigs.Store,
			commonMilestone.ID,
			actorUserID,
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

func setTestMTOCommonMilestoneArchivedState(
	np sqlutils.NamedPreparer,
	id uuid.UUID,
	actorUserID uuid.UUID,
	isArchived bool,
) error {
	return sqlutils.ExecProcedure(
		np,
		`
			UPDATE mto_common_milestone
			SET
				is_archived = :is_archived,
				modified_by = :modified_by,
				modified_dts = CURRENT_TIMESTAMP
			WHERE id = :id
		`,
		map[string]any{
			"id":          id,
			"is_archived": isArchived,
			"modified_by": actorUserID,
		},
	)
}
