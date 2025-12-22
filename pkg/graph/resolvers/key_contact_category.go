package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// CreateKeyContactCategory creates a new key contact category.
// It inserts a new category record with the provided category name.
func CreateKeyContactCategory(logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	categoryStr string,
) (*models.KeyContactCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	newCategory := models.NewKeyContactCategory(principalAccount.ID, categoryStr)
	createdCategory, err := storage.KeyContactCategoryCreate(store, logger, newCategory)
	if err != nil {
		return nil, err
	}

	return createdCategory, nil
}

// UpdateKeyContactCategory updates an existing key contact category.
// Only category field can be changed. Returns the updated category.
func UpdateKeyContactCategory(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	name string,
) (*models.KeyContactCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existingCategory, err := GetKeyContactCategory(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get category with id %s: %w", id, err)
	}
	if existingCategory == nil {
		return nil, fmt.Errorf("category with id %s not found", id)
	}

	existingCategory.Category = name

	err = BaseStructPreUpdate(logger, existingCategory, map[string]interface{}{}, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	updatedCategory, err := storage.KeyContactCategoryUpdate(store, logger, existingCategory)
	if err != nil {
		return nil, fmt.Errorf("failed to update category with id %s: %w", id, err)
	}

	return updatedCategory, nil
}

// DeleteKeyContactCategory deletes a key contact category by its ID.
// Returns the deleted category or an error.
func DeleteKeyContactCategory(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.KeyContactCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Use a transaction for delete (for audit triggers, etc.)
	returnedCategory, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.KeyContactCategory, error) {
		// Fetch the existing category to check permissions and return after delete
		existingCategory, err := GetKeyContactCategory(ctx, id)
		if err != nil {
			logger.Warn("Failed to get category with id", zap.Any("categoryId", id), zap.Error(err))
			return nil, nil
		}

		if existingCategory == nil {
			return nil, fmt.Errorf("category with id %s not found", id)
		}

		// Check permissions
		err = BaseStructPreDelete(logger, existingCategory, principal, store, false)
		if err != nil {
			return nil, fmt.Errorf("error deleting category. user doesn't have permissions. %s", err)
		}

		// Finally, delete the category
		returnedCategory, err := storage.KeyContactCategoryDelete(tx, logger, id)
		if err != nil {
			return nil, fmt.Errorf("unable to delete category. Err %w", err)
		}

		return returnedCategory, nil
	})

	if err != nil {
		return nil, err
	}

	return returnedCategory, nil
}

// GetKeyContactCategory retrieves a key contact category by its ID.
// Returns the category if found, or an error if not found or on failure.
func GetKeyContactCategory(ctx context.Context, id uuid.UUID) (*models.KeyContactCategory, error) {
	category, err := loaders.KeyContactCategory.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get category with id %s: %w", id, err)
	}

	if category == nil {
		return nil, fmt.Errorf("category with id %s not found", id)
	}

	return category, nil
}

// GetAllKeyContactCategories retrieves all key contact categories using a data loader.
// Returns the categories if found, or an error if failure.
func GetAllKeyContactCategories(ctx context.Context) ([]*models.KeyContactCategory, error) {
	categories, err := loaders.KeyContactCategory.GetAll.Load(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get all key contact categories: %w", err)
	}

	if categories == nil {
		categories = []*models.KeyContactCategory{}
	}

	return categories, nil
}
