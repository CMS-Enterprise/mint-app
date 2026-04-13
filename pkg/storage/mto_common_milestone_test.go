package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (s *StoreTestSuite) TestMTOCommonMilestoneArchiveRemovesTemplateReferencesButPreservesAppliedMilestones() {
	actorUserID := s.principal.Account().ID

	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	commonMilestoneID := uuid.New()
	templateID := uuid.New()
	templateMilestoneID := uuid.New()
	templateSolutionID := uuid.New()
	templateMilestoneSolutionLinkID := uuid.New()

	err = insertTestMTOCommonMilestone(tx, commonMilestoneID, actorUserID)
	s.Require().NoError(err)

	commonSolutions, err := MTOCommonSolutionGetByKeyLoader(tx, s.logger, []models.MTOCommonSolutionKey{models.MTOCSKInnovation})
	s.Require().NoError(err)
	s.Require().Len(commonSolutions, 1)

	commonSolution := commonSolutions[0]

	err = insertTestMTOTemplate(tx, templateID, actorUserID)
	s.Require().NoError(err)

	err = insertTestMTOTemplateMilestone(tx, templateMilestoneID, templateID, commonMilestoneID, actorUserID)
	s.Require().NoError(err)

	err = insertTestMTOTemplateSolution(tx, templateSolutionID, templateID, commonSolution.ID, actorUserID)
	s.Require().NoError(err)

	err = insertTestMTOTemplateMilestoneSolutionLink(
		tx,
		templateMilestoneSolutionLinkID,
		templateID,
		templateSolutionID,
		templateMilestoneID,
		actorUserID,
	)
	s.Require().NoError(err)

	err = insertTestMTOCommonMilestoneSolutionLink(tx, commonMilestoneID, commonSolution.Key)
	s.Require().NoError(err)

	modelPlan := models.NewModelPlan(actorUserID, "Archive cascade milestone test")
	createdModelPlan, err := s.store.ModelPlanCreate(tx, s.logger, modelPlan)
	s.Require().NoError(err)

	modelPlanSolutions, err := MTOSolutionCreateCommonAllowConflictsSQL(
		tx,
		s.logger,
		[]models.MTOCommonSolutionKey{commonSolution.Key},
		createdModelPlan.ID,
		actorUserID,
	)
	s.Require().NoError(err)
	s.Require().Len(modelPlanSolutions, 1)

	modelPlanMilestone := models.NewMTOMilestone(actorUserID, nil, nil, &commonMilestoneID, createdModelPlan.ID, nil)
	createdModelPlanMilestone, err := MTOMilestoneCreate(tx, s.logger, modelPlanMilestone)
	s.Require().NoError(err)

	modelPlanMilestoneSolutionLink := models.NewMTOMilestoneSolutionLink(
		actorUserID,
		createdModelPlanMilestone.ID,
		modelPlanSolutions[0].ID,
	)
	createdModelPlanMilestoneSolutionLink, err := MTOMilestoneSolutionLinkCreate(tx, s.logger, modelPlanMilestoneSolutionLink)
	s.Require().NoError(err)

	archivedMilestone, err := archiveMTOCommonMilestone(tx, s.logger, commonMilestoneID, actorUserID)
	s.Require().NoError(err)
	s.Require().NotNil(archivedMilestone)
	s.True(archivedMilestone.IsArchived)

	s.Equal(1, countRowsByID(s, tx, "mto_common_milestone", commonMilestoneID))
	s.True(commonMilestoneIsArchived(s, tx, commonMilestoneID))

	s.Equal(0, countRowsByID(s, tx, "mto_template_milestone", templateMilestoneID))
	s.Equal(0, countRowsByID(s, tx, "mto_template_milestone_solution_link", templateMilestoneSolutionLinkID))
	s.Equal(0, countCommonMilestoneSolutionLinks(s, tx, commonMilestoneID, commonSolution.Key))

	s.Equal(1, countRowsByID(s, tx, "mto_milestone", createdModelPlanMilestone.ID))
	s.Equal(1, countRowsByID(s, tx, "mto_milestone_solution_link", createdModelPlanMilestoneSolutionLink.ID))
}

func insertTestMTOCommonMilestone(tx *sqlx.Tx, id uuid.UUID, actorUserID uuid.UUID) error {
	_, err := tx.Exec(`
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
		id,
		"Archive test common milestone",
		"Used to verify archive cleanup behavior for templates and model plans.",
		"Operations",
		"Archive tests",
		models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorITLead},
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

func insertTestMTOTemplate(tx *sqlx.Tx, id uuid.UUID, actorUserID uuid.UUID) error {
	_, err := tx.Exec(`
		INSERT INTO mto_template (
			id,
			key,
			name,
			description,
			created_by
		)
		VALUES ($1, $2, $3, $4, $5)
	`,
		id,
		models.MTOTemplateKeyStandardCategories,
		fmt.Sprintf("Archive cascade test template %s", id.String()),
		"Temporary template used by archive storage tests.",
		actorUserID,
	)
	if err != nil {
		return fmt.Errorf("insert test template: %w", err)
	}

	return nil
}

func insertTestMTOTemplateMilestone(
	tx *sqlx.Tx,
	id uuid.UUID,
	templateID uuid.UUID,
	commonMilestoneID uuid.UUID,
	actorUserID uuid.UUID,
) error {
	_, err := tx.Exec(`
		INSERT INTO mto_template_milestone (
			id,
			template_id,
			mto_common_milestone_id,
			created_by
		)
		VALUES ($1, $2, $3, $4)
	`,
		id,
		templateID,
		commonMilestoneID,
		actorUserID,
	)
	if err != nil {
		return fmt.Errorf("insert test template milestone: %w", err)
	}

	return nil
}

func insertTestMTOTemplateSolution(
	tx *sqlx.Tx,
	id uuid.UUID,
	templateID uuid.UUID,
	commonSolutionID uuid.UUID,
	actorUserID uuid.UUID,
) error {
	_, err := tx.Exec(`
		INSERT INTO mto_template_solution (
			id,
			template_id,
			mto_common_solution_id,
			created_by
		)
		VALUES ($1, $2, $3, $4)
	`,
		id,
		templateID,
		commonSolutionID,
		actorUserID,
	)
	if err != nil {
		return fmt.Errorf("insert test template solution: %w", err)
	}

	return nil
}

func insertTestMTOTemplateMilestoneSolutionLink(
	tx *sqlx.Tx,
	id uuid.UUID,
	templateID uuid.UUID,
	templateSolutionID uuid.UUID,
	templateMilestoneID uuid.UUID,
	actorUserID uuid.UUID,
) error {
	_, err := tx.Exec(`
		INSERT INTO mto_template_milestone_solution_link (
			id,
			template_id,
			mto_template_solution,
			mto_template_milestone,
			created_by
		)
		VALUES ($1, $2, $3, $4, $5)
	`,
		id,
		templateID,
		templateSolutionID,
		templateMilestoneID,
		actorUserID,
	)
	if err != nil {
		return fmt.Errorf("insert test template milestone solution link: %w", err)
	}

	return nil
}

func insertTestMTOCommonMilestoneSolutionLink(
	tx *sqlx.Tx,
	commonMilestoneID uuid.UUID,
	commonSolutionKey models.MTOCommonSolutionKey,
) error {
	_, err := tx.Exec(`
		INSERT INTO mto_common_milestone_solution_link (
			mto_common_milestone_id,
			mto_common_solution_key
		)
		VALUES ($1, $2)
	`,
		commonMilestoneID,
		commonSolutionKey,
	)
	if err != nil {
		return fmt.Errorf("insert test common milestone solution link: %w", err)
	}

	return nil
}

func countRowsByID(s *StoreTestSuite, tx *sqlx.Tx, tableName string, id uuid.UUID) int {
	s.T().Helper()

	var count int
	err := tx.Get(&count, fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE id = $1", tableName), id)
	s.Require().NoError(err)

	return count
}

func countCommonMilestoneSolutionLinks(
	s *StoreTestSuite,
	tx *sqlx.Tx,
	commonMilestoneID uuid.UUID,
	commonSolutionKey models.MTOCommonSolutionKey,
) int {
	s.T().Helper()

	var count int
	err := tx.Get(
		&count,
		`
			SELECT COUNT(*)
			FROM mto_common_milestone_solution_link
			WHERE mto_common_milestone_id = $1
			  AND mto_common_solution_key = $2
		`,
		commonMilestoneID,
		commonSolutionKey,
	)
	s.Require().NoError(err)

	return count
}

func commonMilestoneIsArchived(s *StoreTestSuite, tx *sqlx.Tx, commonMilestoneID uuid.UUID) bool {
	s.T().Helper()

	var isArchived bool
	err := tx.Get(&isArchived, "SELECT is_archived FROM mto_common_milestone WHERE id = $1", commonMilestoneID)
	s.Require().NoError(err)

	return isArchived
}
