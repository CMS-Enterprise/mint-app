package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (s *StoreTestSuite) TestMTOCommonMilestoneGetByIDLoaderAndArchiveReturnFacilitatedByOther() {
	actorUserID := s.principal.Account().ID
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	commonMilestoneID := uuid.New()
	facilitatedByOther := "Cross-team support"

	err = insertTestMTOCommonMilestone(tx, commonMilestoneID, actorUserID, &facilitatedByOther)
	s.Require().NoError(err)

	loaded, err := MTOCommonMilestoneGetByIDLoader(tx, s.logger, []uuid.UUID{commonMilestoneID})
	s.Require().NoError(err)
	s.Require().Len(loaded, 1)
	s.Require().NotNil(loaded[0].FacilitatedByOther)
	s.Equal(facilitatedByOther, *loaded[0].FacilitatedByOther)

	archived, err := MTOCommonMilestoneArchive(tx, s.logger, commonMilestoneID, actorUserID)
	s.Require().NoError(err)
	s.Require().NotNil(archived)
	s.True(archived.IsArchived)
	s.Require().NotNil(archived.FacilitatedByOther)
	s.Equal(facilitatedByOther, *archived.FacilitatedByOther)
}

func insertTestMTOCommonMilestone(
	tx *sqlx.Tx,
	id uuid.UUID,
	actorUserID uuid.UUID,
	facilitatedByOther *string,
) error {
	_, err := tx.Exec(`
		INSERT INTO mto_common_milestone (
			id,
			name,
			description,
			category_name,
			sub_category_name,
			facilitated_by_role,
			facilitated_by_other,
			section,
			trigger_table,
			trigger_col,
			trigger_vals,
			created_by
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`,
		id,
		fmt.Sprintf("Facilitated by other test %s", id.String()),
		"Used to verify common milestone facilitatedByOther reads.",
		"Operations",
		"Archive tests",
		models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorOther},
		facilitatedByOther,
		models.TLSBasics,
		"plan_basics",
		pq.Array([]string{"status"}),
		pq.Array([]string{"PLAN_DRAFT"}),
		actorUserID,
	)
	if err != nil {
		return fmt.Errorf("insert test common milestone: %w", err)
	}

	return nil
}
