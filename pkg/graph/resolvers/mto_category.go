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
	// Note, the position added is not respected when inserted. It will be have a position equal to the max of all other positions
	category := models.NewMTOCategory(principalAccount.ID, name, modelPlanID, parentID, 0)

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
	order *int,
	parentID *uuid.UUID,
) (*models.MTOCategory, error) {
	if order == nil && parentID == nil {
		return nil, fmt.Errorf(" either order or parentID must be provided for MTOCategoryReorder")
	}
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOCategoryGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO category. Err %w", err)
	}
	// update the position to the new value
	// the re-ordering of other rows is handled in the trigger added in migrations/V188__Add_MTO_Category_Reorder_Trigger.sql
	if order != nil {
		existing.Position = *order
	}
	if parentID != nil {
		if existing.ParentID == nil {
			return nil, fmt.Errorf("you cannot provide a parent id for a parent category")
		}
		// If the changing parents, update here
		if existing.ParentID != parentID {
			existing.ParentID = parentID
			// If an order wasn't provided, determine the position from the other subcategories
			if order == nil {
				existingSubCategories, err := loaders.MTOSubcategory.ByParentID.Load(ctx, *parentID)
				if err != nil {
					return nil, fmt.Errorf("unable to determine order for this new subcategory. Err %w", err)
				}
				currentMax := models.GetMaxPosition(existingSubCategories)
				existing.Position = currentMax + 1
			}
		}
	}

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
	return append(dbCategories, models.MTOUncategorizedFromArray(modelPlanID, nil, dbCategories)), nil
}

// MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER implements resolver logic to get all MTO Categories (including subcategories) by a model plan ID using a data loader
func MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOCategory, error) {
	//TODO, consider removing this. It probably doesn't make sense conceptually, as you are only making on uncategorized
	// , and giving it a max position of all categories

	dbCategories, err := loaders.MTOCategory.AndSubCategoriesByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbCategories, models.MTOUncategorizedFromArray(modelPlanID, nil, dbCategories)), nil
}

func MTOSubcategoryGetByParentIDLoader(ctx context.Context, modelPlanID uuid.UUID, parentID uuid.UUID) ([]*models.MTOSubcategory, error) {
	dbSubcategories, err := loaders.MTOSubcategory.ByParentID.Load(ctx, parentID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbSubcategories, models.MTOUncategorizedSubcategoryFromArray(modelPlanID, &parentID, dbSubcategories)), nil
}