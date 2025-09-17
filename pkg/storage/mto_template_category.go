package storage

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOTemplateCategoryGetByIDLoader returns template categories by ID
func MTOTemplateCategoryGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOTemplateCategory, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateCategory](np, sqlqueries.MTOTemplateCategory.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// MTOTemplateCategoryGetByTemplateIDLoader returns template categories by template ID
func MTOTemplateCategoryGetByTemplateIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, templateIDs []uuid.UUID) ([]*models.MTOTemplateCategory, error) {
	args := map[string]interface{}{
		"template_ids": pq.Array(templateIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateCategory](np, sqlqueries.MTOTemplateCategory.GetByTemplateIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// MTOTemplateSubCategoryGetByIDLoader returns template subcategories by ID
func MTOTemplateSubCategoryGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOTemplateSubCategory, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateSubCategory](np, sqlqueries.MTOTemplateCategory.GetSubCategoryByIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOTemplateSubCategoryGetByCategoryIDLoader returns template subcategories by category ID
func MTOTemplateSubCategoryGetByCategoryIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, categoryIDs []uuid.UUID) ([]*models.MTOTemplateSubCategory, error) {
	args := map[string]interface{}{
		"category_ids": pq.Array(categoryIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.MTOTemplateSubCategory](np, sqlqueries.MTOTemplateCategory.GetByCategoryIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}
