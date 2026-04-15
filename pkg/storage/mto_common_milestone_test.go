package storage

import (
	"fmt"
	"sort"

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

	err = insertTestMTOCommonMilestone(
		tx,
		commonMilestoneID,
		actorUserID,
		models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorModelTeam},
		nil,
	)
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

func (s *StoreTestSuite) TestMTOCommonMilestoneGetByIDLoaderAndArchiveReturnFacilitatedByOther() {
	actorUserID := s.principal.Account().ID
	tx, err := s.store.Beginx()
	s.Require().NoError(err)
	defer tx.Rollback()

	commonMilestoneID := uuid.New()
	facilitatedByOther := "Cross-team support"

	err = insertTestMTOCommonMilestone(
		tx,
		commonMilestoneID,
		actorUserID,
		models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorOther},
		&facilitatedByOther,
	)
	s.Require().NoError(err)

	loaded, err := MTOCommonMilestoneGetByIDLoader(tx, s.logger, []uuid.UUID{commonMilestoneID})
	s.Require().NoError(err)
	s.Require().Len(loaded, 1)
	s.Require().NotNil(loaded[0].FacilitatedByOther)
	s.Equal(facilitatedByOther, *loaded[0].FacilitatedByOther)

	archived, err := archiveMTOCommonMilestone(tx, s.logger, commonMilestoneID, actorUserID)
	s.Require().NoError(err)
	s.Require().NotNil(archived)
	s.True(archived.IsArchived)
	s.Require().NotNil(archived.FacilitatedByOther)
	s.Equal(facilitatedByOther, *archived.FacilitatedByOther)
}

func (s *StoreTestSuite) TestMTOCommonMilestoneFacilitatedByOtherConstraint() {
	actorUserID := s.principal.Account().ID
	s.Run("rejects facilitated_by_other without OTHER", func() {
		tx, err := s.store.Beginx()
		s.Require().NoError(err)
		defer tx.Rollback()

		commonMilestoneID := uuid.New()
		facilitatedByOther := "Cross-team support"

		err = insertTestMTOCommonMilestone(
			tx,
			commonMilestoneID,
			actorUserID,
			models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorModelTeam},
			&facilitatedByOther,
		)
		s.Require().Error(err)
		s.Contains(err.Error(), "mto_common_milestone_check_facilitated_by_other_only_if_other")
	})

	s.Run("rejects OTHER without facilitated_by_other", func() {
		tx, err := s.store.Beginx()
		s.Require().NoError(err)
		defer tx.Rollback()

		commonMilestoneID := uuid.New()

		err = insertTestMTOCommonMilestone(
			tx,
			commonMilestoneID,
			actorUserID,
			models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorOther},
			nil,
		)
		s.Require().Error(err)
		s.Contains(err.Error(), "mto_common_milestone_check_other_requires_facilitated_by_other")
	})

	s.Run("rejects empty facilitated_by_other", func() {
		tx, err := s.store.Beginx()
		s.Require().NoError(err)
		defer tx.Rollback()

		commonMilestoneID := uuid.New()
		facilitatedByOther := ""

		err = insertTestMTOCommonMilestone(
			tx,
			commonMilestoneID,
			actorUserID,
			models.EnumArray[models.MTOFacilitator]{models.MTOFacilitatorOther},
			&facilitatedByOther,
		)
		s.Require().Error(err)
		s.Contains(err.Error(), "zero_string_check")
	})
}

func insertTestMTOCommonMilestone(
	tx *sqlx.Tx,
	id uuid.UUID,
	actorUserID uuid.UUID,
	facilitatedByRole models.EnumArray[models.MTOFacilitator],
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
		facilitatedByRole,
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
func (s *StoreTestSuite) TestMTOCommonMilestoneGetCommonCategories() {
	s.Run("returns deduplicated sorted options from seeded template data", func() {
		options, err := MTOCommonMilestoneGetCommonCategories(s.store, s.logger)
		s.NoError(err)
		s.NotEmpty(options)

		categoryNames := make([]string, 0, len(options))
		categorySeen := make(map[string]struct{}, len(options))

		for _, option := range options {
			s.Require().NotNil(option)
			s.NotEmpty(option.Name)

			_, alreadySeen := categorySeen[option.Name]
			s.False(alreadySeen)
			categorySeen[option.Name] = struct{}{}
			categoryNames = append(categoryNames, option.Name)

			s.True(sort.StringsAreSorted(option.SubCategories))

			subCategorySeen := make(map[string]struct{}, len(option.SubCategories))
			for _, subCategory := range option.SubCategories {
				_, subCategoryAlreadySeen := subCategorySeen[subCategory]
				s.False(subCategoryAlreadySeen)
				subCategorySeen[subCategory] = struct{}{}
			}
		}

		s.True(sort.StringsAreSorted(categoryNames))

		operations := findCommonCategoryByName(options, "Operations")
		s.Require().NotNil(operations)
		s.Contains(operations.SubCategories, "Internal functions")
		s.Contains(operations.SubCategories, "Set up operations")

		participants := findCommonCategoryByName(options, "Participants")
		s.Require().NotNil(participants)
		s.Contains(participants.SubCategories, "Application, review, and selection")
		s.Contains(participants.SubCategories, "Participant support")

		evaluation := findCommonCategoryByName(options, "Evaluation")
		s.Require().NotNil(evaluation)
		s.Empty(evaluation.SubCategories)

		learning := findCommonCategoryByName(options, "Learning")
		s.Require().NotNil(learning)
		s.Empty(learning.SubCategories)
	})

	s.Run("includes empty top level categories, collapses lone Uncategorized, and deduplicates duplicate child names", func() {
		tx, err := s.store.Beginx()
		s.NoError(err)
		s.Require().NotNil(tx)
		defer tx.Rollback()

		templateID := uuid.New()
		operationsCategoryID := uuid.New()
		emptyCategoryID := uuid.New()
		uncategorizedCategoryID := uuid.New()
		actorID := s.principal.Account().ID

		err = insertTemplateCategoryTestTemplate(tx, templateID, actorID)
		s.NoError(err)

		err = insertTemplateCategoryTestCategory(tx, operationsCategoryID, templateID, "Operations", nil, 0, actorID)
		s.NoError(err)

		err = insertTemplateCategoryTestCategory(tx, emptyCategoryID, templateID, "ZZZ Empty Category", nil, 1, actorID)
		s.NoError(err)

		err = insertTemplateCategoryTestCategory(tx, uncategorizedCategoryID, templateID, "ZZZ Uncategorized Category", nil, 2, actorID)
		s.NoError(err)

		err = insertTemplateCategoryTestCategory(tx, uuid.New(), templateID, "ZZZ Added Child", &operationsCategoryID, 0, actorID)
		s.NoError(err)

		err = insertTemplateCategoryTestCategory(tx, uuid.New(), templateID, "Internal functions", &operationsCategoryID, 1, actorID)
		s.NoError(err)

		err = insertTemplateCategoryTestCategory(tx, uuid.New(), templateID, "Internal functions", &operationsCategoryID, 2, actorID)
		s.NoError(err)

		err = insertTemplateCategoryTestCategory(tx, uuid.New(), templateID, "Uncategorized", &uncategorizedCategoryID, 0, actorID)
		s.NoError(err)

		options, err := MTOCommonMilestoneGetCommonCategories(tx, s.logger)
		s.NoError(err)

		emptyCategory := findCommonCategoryByName(options, "ZZZ Empty Category")
		s.Require().NotNil(emptyCategory)
		s.Empty(emptyCategory.SubCategories)

		uncategorizedCategory := findCommonCategoryByName(options, "ZZZ Uncategorized Category")
		s.Require().NotNil(uncategorizedCategory)
		s.Empty(uncategorizedCategory.SubCategories)

		operations := findCommonCategoryByName(options, "Operations")
		s.Require().NotNil(operations)
		s.True(sort.StringsAreSorted(operations.SubCategories))
		s.Contains(operations.SubCategories, "ZZZ Added Child")
		s.Equal(1, countStringOccurrences(operations.SubCategories, "Internal functions"))
	})
}

func findCommonCategoryByName(options []*models.CommonCategory, name string) *models.CommonCategory {
	for _, option := range options {
		if option != nil && option.Name == name {
			return option
		}
	}
	return nil
}

func countStringOccurrences(values []string, target string) int {
	count := 0
	for _, value := range values {
		if value == target {
			count++
		}
	}
	return count
}

func insertTemplateCategoryTestTemplate(tx *sqlx.Tx, id uuid.UUID, actorID uuid.UUID) error {
	_, err := tx.Exec(
		`INSERT INTO mto_template (id, key, name, created_by)
		 VALUES ($1, $2::MTO_TEMPLATE_KEY, $3, $4)`,
		id,
		string(models.MTOTemplateKeyStandardCategories),
		"ZZZ Common Milestone Categories Test",
		actorID,
	)
	return err
}

func insertTemplateCategoryTestCategory(
	tx *sqlx.Tx,
	id uuid.UUID,
	templateID uuid.UUID,
	name string,
	parentID *uuid.UUID,
	order int,
	actorID uuid.UUID,
) error {
	_, err := tx.Exec(
		`INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		id,
		templateID,
		name,
		parentID,
		order,
		actorID,
	)
	return err
}
