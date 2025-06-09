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

// MTOCommonSolutionContractorsGetByKeyLOADER loads all contractors for a given MTOCommonSolutionKey using the dataloader.
// Returns a slice of contractors or an error.
func MTOCommonSolutionContractorsGetByKeyLOADER(ctx context.Context, key models.MTOCommonSolutionKey) ([]*models.MTOCommonSolutionContractor, error) {
	contractors, err := loaders.MTOCommonSolutionContractor.ByCommonSolutionKey.Load(ctx, key)
	if err != nil {
		return nil, err
	}

	return contractors, nil
}

// CreateMTOCommonSolutionContractor creates a new contractor for a common solution.
// Accepts the solution key, optional contractor title, and contractor name. Returns the created contractor or an error.
func CreateMTOCommonSolutionContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	key models.MTOCommonSolutionKey,
	contractorTitle *string,
	contractorName string,
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	userContractor := models.NewMTOCommonSolutionContractor(
		principalAccount.ID,
		key,
		contractorTitle,
		contractorName,
	)

	return storage.MTOCommonSolutionCreateContractor(
		store,
		logger,
		userContractor,
	)
}

// UpdateMTOCommonSolutionContractor updates an existing contractor for a common solution.
// Accepts the contractor ID and a map of changes. Returns the updated contractor or an error.
func UpdateMTOCommonSolutionContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existingContractor, err := loaders.MTOCommonSolutionContractor.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contractor with id %s: %w", id, err)
	}
	if existingContractor == nil {
		return nil, fmt.Errorf("contractor with id %s not found", id)
	}

	err = BaseStructPreUpdate(logger, existingContractor, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	updatedContractor, err := storage.MTOCommonSolutionUpdateContractor(store, logger, existingContractor)
	if err != nil {
		return nil, fmt.Errorf("failed to update contractor with id %s: %w", id, err)
	}

	return updatedContractor, nil
}

// DeleteMTOCommonSolutionContractor deletes a contractor for a common solution by its ID.
// Returns the deleted contractor or an error.
func DeleteMTOCommonSolutionContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	// Write up a transaction since storage.MTOSolutionDelete needs one for setting `delete` session user variables
	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOCommonSolutionContractor, error) {
		// First, fetch the existing solution so we can check permissions
		retContractor, err := loaders.MTOCommonSolutionContractor.ByID.Load(ctx, id)
		if err != nil {
			logger.Warn("Failed to get contractor with id", zap.Any("contractorId", id), zap.Error(err))
			return nil, nil
		}

		if retContractor == nil {
			return nil, fmt.Errorf("contractor with id %s not found", id)
		}

		// Check permissions
		err = BaseStructPreDelete(logger, retContractor, principal, store, false)
		if err != nil {
			return nil, fmt.Errorf("error deleting mto solution. user doesnt have permissions. %s", err)
		}

		// Finally, delete the contractor
		if err := storage.MTOCommonSolutionDeleteContractorByID(tx, principalAccount.ID, logger, id); err != nil {
			return nil, fmt.Errorf("unable to delete mto contractor. Err %w", err)
		}
		return retContractor, nil
	})
}

// GetMTOCommonSolutionContractor retrieves a contractor for a common solution by its ID.
// Returns the contractor if found, or an error if not found or on failure.
func GetMTOCommonSolutionContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	contractor, err := loaders.MTOCommonSolutionContractor.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contractor with id %s: %w", id, err)
	}

	return contractor, nil
}
