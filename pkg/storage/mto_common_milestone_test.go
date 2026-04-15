package storage

import (
	"fmt"
	"sort"

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

	archived, err := MTOCommonMilestoneArchive(tx, s.logger, commonMilestoneID, actorUserID)
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
