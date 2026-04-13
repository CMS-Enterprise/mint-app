package storage

import (
	"sort"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (s *StoreTestSuite) TestMTOTemplateCategoriesGetAll() {
	s.Run("returns deduplicated sorted options from seeded template data", func() {
		options, err := MTOTemplateCategoriesGetAll(s.store, s.logger)
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

		operations := findTemplateCategoryOptionByName(options, "Operations")
		s.Require().NotNil(operations)
		s.Contains(operations.SubCategories, "Internal functions")
		s.Contains(operations.SubCategories, "Set up operations")

		participants := findTemplateCategoryOptionByName(options, "Participants")
		s.Require().NotNil(participants)
		s.Contains(participants.SubCategories, "Application, review, and selection")
		s.Contains(participants.SubCategories, "Participant support")

		evaluation := findTemplateCategoryOptionByName(options, "Evaluation")
		s.Require().NotNil(evaluation)
		s.Empty(evaluation.SubCategories)

		learning := findTemplateCategoryOptionByName(options, "Learning")
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

		options, err := MTOTemplateCategoriesGetAll(tx, s.logger)
		s.NoError(err)

		emptyCategory := findTemplateCategoryOptionByName(options, "ZZZ Empty Category")
		s.Require().NotNil(emptyCategory)
		s.Empty(emptyCategory.SubCategories)

		uncategorizedCategory := findTemplateCategoryOptionByName(options, "ZZZ Uncategorized Category")
		s.Require().NotNil(uncategorizedCategory)
		s.Empty(uncategorizedCategory.SubCategories)

		operations := findTemplateCategoryOptionByName(options, "Operations")
		s.Require().NotNil(operations)
		s.True(sort.StringsAreSorted(operations.SubCategories))
		s.Contains(operations.SubCategories, "ZZZ Added Child")
		s.Equal(1, countStringOccurrences(operations.SubCategories, "Internal functions"))
	})
}

func findTemplateCategoryOptionByName(options []*models.MTOTemplateCategoryOption, name string) *models.MTOTemplateCategoryOption {
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
		"ZZZ Template Category Options Test",
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
