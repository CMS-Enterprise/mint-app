package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCategoryCreate uses the provided information to create a new mto category
func MTOCategoryCreate(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	name string,
	modelPlanID uuid.UUID,
	parentID *uuid.UUID,
) (*models.MTOCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	category := models.NewMTOCategory(principalAccount.ID, name, modelPlanID, parentID)

	err := BaseStructPreCreate(logger, category, principal, store, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOCategoryCreate(store, logger, category)
}

// MTOCategoryRename updates the name of MTOCategory or SubCategory
func MTOCategoryRename(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	name string,
) (*models.MTOCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOCategoryGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO category. Err %w", err)
	}
	// update the name
	existing.Name = name

	// Just check access, don't apply changes here
	err = BaseStructPreUpdate(logger, existing, map[string]interface{}{}, principal, store, false, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOCategoryUpdate(store, logger, existing)
}

// MTOCategoryReorder updates the position of an MTOCategory or SubCategory
func MTOCategoryReorder(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	order int,
) (*models.MTOCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOCategoryGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO category. Err %w", err)
	}
	// update the name
	existing.Position = order

	// Just check access, don't apply changes here
	err = BaseStructPreUpdate(logger, existing, map[string]interface{}{}, principal, store, false, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOCategoryUpdate(store, logger, existing)
}

// MTOCategoryGetByModelPlanIDLOADER implements resolver logic to get all parent level MTO Categories by a model plan ID using a data loader
func MTOCategoryGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOCategory, error) {
	dbCategories, err := loaders.MTOCategory.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbCategories, models.MTOUncategorized(modelPlanID, nil)), nil
}

// MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER implements resolver logic to get all MTO Categories (including subcategories) by a model plan ID using a data loader
func MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOCategory, error) {
	dbCategories, err := loaders.MTOCategory.AndSubCategoriesByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbCategories, models.MTOUncategorized(modelPlanID, nil)), nil
}

func MTOSubcategoryGetByParentIDLoader(ctx context.Context, modelPlanID uuid.UUID, parentID uuid.UUID) ([]*models.MTOSubcategory, error) {
	dbCategories, err := loaders.MTOSubcategory.ByParentID.Load(ctx, parentID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbCategories, models.MTOUncategorizedSubcategory(modelPlanID, &parentID)), nil
}
