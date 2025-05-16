package storage

import (
	"fmt"

	"github.com/jmoiron/sqlx"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCategoryGetByIDLoader returns all categories by the provided
func MTOCategoryGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOCategory, error) {

	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCategoryGetByModelPlanIDLoader returns all top level categories for a slice of model plan ids
func MTOCategoryGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOCategory, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCategoryAndSubCategoriesGetByModelPlanIDLoader returns all mto categories for a slice of model plan ids
func MTOCategoryAndSubCategoriesGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOCategory, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.AndSubCategoriesGetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOSubcategoryGetByParentIDLoader returns the categories that are sub categories for a slice of category ids
// Note, this returns the object as a subcategory, but it is the same table
func MTOSubcategoryGetByParentIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, parentIDs []uuid.UUID) ([]*models.MTOSubcategory, error) {

	args := map[string]interface{}{
		"parent_ids": pq.Array(parentIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOSubcategory](np, sqlqueries.MTOCategory.GetByParentIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCategoryCreate creates a new MTOCategory in the database
func MTOCategoryCreate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCategory *models.MTOCategory) (*models.MTOCategory, error) {
	if MTOCategory.ID == uuid.Nil {
		MTOCategory.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.Create, MTOCategory)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOCategory object: %w", procErr)
	}
	return returned, nil
}

// MTOCategoryDelete deletes an existing MTOCategory from the database
func MTOCategoryDelete(tx *sqlx.Tx, actorUserID uuid.UUID, id uuid.UUID) error {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return err
	}

	// Delete the MTOCategory
	// Note: Child subcategories are deleted by the database. If this category is assigned, the reference will be set
	// to the parent category or NULL if this is a top-level category
	arg := map[string]interface{}{"id": id}

	_, procErr := sqlutils.GetProcedure[models.MTOCategory](tx, sqlqueries.MTOCategory.Delete, arg)
	if procErr != nil {
		return fmt.Errorf("issue deleting MTOCategory object: %w", procErr)
	}
	return nil
}

// MTOCategoryCreateAllowConflicts creates a new MTOCategory in the database, but in the case of a conflict, instead just
// returns the conflicting row (and doesn't return an error)
// In all other ways, it is effectively equivalent to MTOCategoryCreate
func MTOCategoryCreateAllowConflicts(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCategory *models.MTOCategory) (*models.MTOCategory, error) {
	if MTOCategory.ID == uuid.Nil {
		MTOCategory.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.CreateAllowConflicts, MTOCategory)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOCategory object (MTOCategoryCreateAllowConflicts): %w", procErr)
	}
	return returned, nil
}

// MTOCategoryUpdate updates a new MTOCategory in the database
func MTOCategoryUpdate(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCategory *models.MTOCategory) (*models.MTOCategory, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.Update, MTOCategory)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating MTOCategory object: %w", procErr)
	}
	return returned, nil
}

// MTOCategoryGetByID returns an existing MTOCategory from the database
func MTOCategoryGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOCategory, error) {

	arg := map[string]interface{}{"id": id}

	returned, procErr := sqlutils.GetProcedure[models.MTOCategory](np, sqlqueries.MTOCategory.GetByID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue retrieving MTOCategory: %w", procErr)
	}

	return returned, nil
}
