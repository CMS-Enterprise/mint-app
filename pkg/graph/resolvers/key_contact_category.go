package resolvers

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
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
func UpdateKeyContactCategory(logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.KeyContactCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existingCategory, err := storage.KeyContactCategoryGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get category with id %s: %w", id, err)
	}

	if existingCategory == nil {
		return nil, fmt.Errorf("category with id %s not found", id)
	}

	// Apply changes
	if category, ok := changes["category"].(string); ok {
		existingCategory.Category = category
	}

	// Set modified by
	existingCategory.ModifiedBy = &principalAccount.ID

	updatedCategory, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.KeyContactCategory, error) {
		updatedCategory, err := storage.KeyContactCategoryUpdate(tx, logger, existingCategory)
		if err != nil {
			return nil, fmt.Errorf("failed to update category with id %s: %w", id, err)
		}
		return updatedCategory, nil
	})

	if err != nil {
		return nil, err
	}

	return updatedCategory, nil
}

// DeleteKeyContactCategory deletes a key contact category by its ID.
// Returns the deleted category or an error.
func DeleteKeyContactCategory(logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.KeyContactCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Use a transaction for delete (for audit triggers, etc.)
	returnedCategory, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.KeyContactCategory, error) {
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
func GetKeyContactCategory(logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.KeyContactCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	category, err := storage.KeyContactCategoryGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get category with id %s: %w", id, err)
	}

	if category == nil {
		return nil, fmt.Errorf("category with id %s not found", id)
	}

	return category, nil
}

// GetAllKeyContactCategories retrieves all key contact categories.
// Returns the categories if found, or an error if failure.
func GetAllKeyContactCategories(logger *zap.Logger, store *storage.Store) ([]*models.KeyContactCategory, error) {
	categories, err := storage.KeyContactCategoryGetAll(store, logger)
	if err != nil {
		return nil, fmt.Errorf("failed to get all key contact categories: %w", err)
	}

	return categories, nil
}
