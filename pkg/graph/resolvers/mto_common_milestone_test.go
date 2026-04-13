package resolvers

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *ResolverSuite) TestArchiveMTOCommonMilestone() {
	commonMilestone := suite.createTestMTOCommonMilestone()
	if suite.NotNil(commonMilestone) {
		defer suite.cleanupTestMTOCommonMilestone(commonMilestone.ID)
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

func (suite *ResolverSuite) createTestMTOCommonMilestone() *models.MTOCommonMilestone {
	commonMilestoneID := uuid.New()

	err := sqlutils.WithTransactionNoReturn(suite.testConfigs.Store, func(tx *sqlx.Tx) error {
		_, execErr := tx.Exec(`
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
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		`,
			commonMilestoneID,
			fmt.Sprintf("Archive resolver test %s", commonMilestoneID.String()),
			"Used to verify archiving a common milestone.",
			"Operations",
			"Archive tests",
			models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorModelTeam},
			models.TLSBasics,
			"plan_basics",
			pq.Array([]string{"status"}),
			pq.Array([]string{"PLAN_DRAFT"}),
			suite.testConfigs.Principal.UserAccount.ID,
		)
		if execErr != nil {
			return fmt.Errorf("insert test common milestone: %w", execErr)
		}

		return nil
	})
	suite.Require().NoError(err)

	loaded, err := storage.MTOCommonMilestoneGetByIDLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		[]uuid.UUID{commonMilestoneID},
	)
	suite.Require().NoError(err)
	suite.Require().Len(loaded, 1)

	return loaded[0]
}

func (suite *ResolverSuite) cleanupTestMTOCommonMilestone(id uuid.UUID) {
	err := sqlutils.WithTransactionNoReturn(suite.testConfigs.Store, func(tx *sqlx.Tx) error {
		_, execErr := tx.NamedExec(
			sqlqueries.Utility.SetSessionCurrentUser,
			utilitysql.CreateUserIDQueryMap(suite.testConfigs.Principal.UserAccount.ID),
		)
		if execErr != nil {
			return fmt.Errorf("set session user variable: %w", execErr)
		}

		_, execErr = tx.Exec(`DELETE FROM mto_common_milestone WHERE id = $1`, id)
		if execErr != nil {
			return fmt.Errorf("delete test common milestone: %w", execErr)
		}

		return nil
	})
	suite.NoError(err)
}
