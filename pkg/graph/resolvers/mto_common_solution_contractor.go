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

// CreateMTOCommonSolutionUserContractor creates a new contractor for a common solution.
// Accepts the solution key, optional contractor title, and contractor name. Returns the created contractor or an error.
func CreateMTOCommonSolutionUserContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	key models.MTOCommonSolutionKey,
	contractorTitle *string,
	contractorName string,
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	title := ""
	if contractorTitle != nil {
		title = *contractorTitle
	}

	userContractor := models.NewMTOCommonSolutionContractor(
		principalAccount.ID,
		key,
		title,
		contractorName,
	)

	return storage.MTOCommonSolutionCreateContractor(
		store,
		logger,
		userContractor,
	)
}

// UpdateMTOCommonSolutionUserContractor updates an existing contractor for a common solution.
// Accepts the contractor ID and a map of changes. Returns the updated contractor or an error.
func UpdateMTOCommonSolutionUserContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existing_Contractor, err := storage.MTOCommonSolutionGetContractorByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contractor with id %s: %w", id, err)
	}
	if existing_Contractor == nil {
		return nil, fmt.Errorf("contractor with id %s not found", id)
	}

	err = BaseStructPreUpdate(logger, existing_Contractor, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	updatedContractor, err := storage.MTOCommonSolutionUpdateContractor(store, logger, existing_Contractor)
	if err != nil {
		return nil, fmt.Errorf("failed to update contractor with id %s: %w", id, err)
	}

	return updatedContractor, nil
}

// DeleteMTOCommonSolutionUserContractor deletes a contractor for a common solution by its ID.
// Returns the deleted contractor or an error.
func DeleteMTOCommonSolutionUserContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existing := &models.MTOCommonSolutionContractor{}

	// Write up a transaction since storage.MTOSolutionDelete needs one for setting `delete` session user variables
	err := sqlutils.WithTransactionNoReturn(store, func(tx *sqlx.Tx) error {
		// First, fetch the existing solution so we can check permissions
		var err error
		existing, err = storage.MTOCommonSolutionGetContractorByID(store, logger, id)
		if err != nil {
			return fmt.Errorf("failed to get contractor with id %s: %w", id, err)
		}

		if existing == nil {
			return fmt.Errorf("contractor with id %s not found", id)
		}

		// Check permissions
		err = BaseStructPreDelete(logger, existing, principal, store, true)
		if err != nil {
			return fmt.Errorf("error deleting mto solution. user doesnt have permissions. %s", err)
		}

		// Finally, delete the contractor
		if err := storage.MTOCommonSolutionDeleteContractorByID(tx, principalAccount.ID, logger, id); err != nil {
			return fmt.Errorf("unable to delete mto contractor. Err %w", err)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return existing, nil
}

// GetMTOCommonSolutionUserContractor retrieves a contractor for a common solution by its ID.
// Returns the contractor if found, or an error if not found or on failure.
func GetMTOCommonSolutionUserContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	Contractor, err := storage.MTOCommonSolutionGetContractorByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contractor with id %s: %w", id, err)
	}

	if Contractor == nil {
		return nil, fmt.Errorf("contractor with id %s is nil", id)
	}

	return Contractor, nil
}
