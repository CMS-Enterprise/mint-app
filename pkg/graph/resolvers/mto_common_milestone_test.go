package resolvers

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *ResolverSuite) TestArchiveMTOCommonMilestone() {
	actorUserID := suite.testConfigs.Principal.UserAccount.ID
	commonMilestoneID := uuid.New()

	suite.Require().NoError(insertTestMTOCommonMilestone(
		suite.testConfigs.Store,
		commonMilestoneID,
		actorUserID,
	))
	suite.T().Cleanup(func() {
		suite.NoError(deleteTestMTOCommonMilestone(
			suite.testConfigs.Store,
			commonMilestoneID,
		))
	})

	archivedMilestone, err := ArchiveMTOCommonMilestone(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		commonMilestoneID,
		actorUserID,
	)
	suite.NoError(err)
	if suite.NotNil(archivedMilestone) {
		suite.Equal(commonMilestoneID, archivedMilestone.ID)
		suite.True(archivedMilestone.IsArchived)
	}

	reloaded, err := storage.MTOCommonMilestoneGetByIDLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		[]uuid.UUID{commonMilestoneID},
	)
	suite.NoError(err)
	if suite.Len(reloaded, 1) {
		suite.True(reloaded[0].IsArchived)
	}
}

func insertTestMTOCommonMilestone(
	np sqlutils.NamedPreparer,
	id uuid.UUID,
	actorUserID uuid.UUID,
) error {
	return sqlutils.ExecProcedure(
		np,
		`
			INSERT INTO mto_common_milestone (
				id,
				name,
				description,
				category_name,
				sub_category_name,
				facilitated_by_role,
				section,
				trigger_table,
				trigger_col,
				trigger_vals,
				created_by
			)
			VALUES (
				:id,
				:name,
				:description,
				:category_name,
				:sub_category_name,
				:facilitated_by_role,
				:section,
				:trigger_table,
				:trigger_col,
				:trigger_vals,
				:created_by
			)
		`,
		map[string]any{
			"id":                id,
			"name":              fmt.Sprintf("Archive resolver test milestone %s", id.String()),
			"description":       "Temporary common milestone used for resolver archive testing.",
			"category_name":     "Operations",
			"sub_category_name": "Archive tests",
			"facilitated_by_role": models.EnumArray[models.MTOFacilitator]{
				models.MTOFacilitatorITLead,
			},
			"section":       models.TLSBasics,
			"trigger_table": "plan_basics",
			"trigger_col":   pq.Array([]string{"status"}),
			"trigger_vals":  pq.Array([]string{"PLAN_DRAFT"}),
			"created_by":    actorUserID,
		},
	)
}

func deleteTestMTOCommonMilestone(np sqlutils.NamedPreparer, id uuid.UUID) error {
	return sqlutils.ExecProcedure(
		np,
		`DELETE FROM mto_common_milestone WHERE id = :id`,
		map[string]any{
			"id": id,
		},
	)
}
