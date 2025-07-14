package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCommonSolutionSystemOwnersGetByKeyLOADER loads the system owner for a given MTOCommonSolutionKey using the dataloader.
// Returns a system owner or an error.
func MTOCommonSolutionSystemOwnersGetByKeyLOADER(ctx context.Context, key models.MTOCommonSolutionKey) ([]*models.MTOCommonSolutionSystemOwner, error) {
	owners, err := loaders.MTOCommonSolutionSystemOwner.ByCommonSolutionKey.Load(ctx, key)
	if err != nil {
		return nil, nil // Don't want to error if the system owner is not found on a common solution
	}

	return owners, nil
}

// CreateMTOCommonSolutionSystemOwner creates a new systemOwner for a common solution.
// Accepts the solution key, system owner type, and cmsComponent. Returns the created system owner or an error.
func CreateMTOCommonSolutionSystemOwner(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	key models.MTOCommonSolutionKey,
	changes map[string]interface{},
) (*models.MTOCommonSolutionSystemOwner, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Explicitly convert ownerType to models.MTOCommonSolutionOwnerType
	ownerType, ok := changes["ownerType"].(string)
	if !ok {
		return nil, fmt.Errorf("ownerType must be a string")
	}

	// Explicitly convert cmsComponent to models.MTOCommonSolutionOwnerType
	cmsComponent, ok := changes["cmsComponent"].(string)
	if !ok {
		return nil, fmt.Errorf("cmsComponent must be a string")
	}

	systemOwner := models.NewMTOCommonSolutionSystemOwner(
		principalAccount.ID,
		key,
		models.MTOCommonSolutionOwnerType(ownerType),
		models.MTOCommonSolutionCMSComponent(cmsComponent),
	)

	returnedSystemOwner, err := storage.MTOCommonSolutionCreateSystemOwner(
		store,
		logger,
		systemOwner,
	)
	if err != nil {
		return nil, err
	}

	// TODO add emails here for create

	return returnedSystemOwner, nil
}

// UpdateMTOCommonSolutionSystemOwner updates an existing system owner for a common solution.
// Accepts the system owner ID and a map of changes. Returns the updated system owner or an error.
func UpdateMTOCommonSolutionSystemOwner(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.MTOCommonSolutionSystemOwner, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existingSystemOwner, err := loaders.MTOCommonSolutionSystemOwner.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get system owner with id %s: %w", id, err)
	}
	if existingSystemOwner == nil {
		return nil, fmt.Errorf("system owner with id %s not found", id)
	}

	err = BaseStructPreUpdate(logger, existingSystemOwner, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	updatedSystemOwner, err := storage.MTOCommonSolutionSystemOwnerUpdate(store, logger, existingSystemOwner)
	if err != nil {
		return nil, fmt.Errorf("failed to update system owner with id %s: %w", id, err)
	}

	// TODO add update email here

	return updatedSystemOwner, nil
}

// DeleteMTOCommonSolutionSystemOwner deletes a system owner for a common solution by its ID.
// Returns the deleted system owner or an error.
func DeleteMTOCommonSolutionSystemOwner(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	id uuid.UUID,
) (*models.MTOCommonSolutionSystemOwner, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	// Write up a transaction since storage.MTOSolutionDelete needs one for setting `delete` session user variables
	returnedSystemOwner, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOCommonSolutionSystemOwner, error) {
		// First, fetch the existing solution so we can check permissions
		existing, err := loaders.MTOCommonSolutionSystemOwner.ByID.Load(ctx, id)
		if err != nil {
			logger.Warn("Failed to get system owner with id", zap.Any("systemOwnerId", id), zap.Error(err))
			return nil, nil
		}

		if existing == nil {
			return nil, fmt.Errorf("system owner with id %s not found", id)
		}

		// Check permissions
		err = BaseStructPreDelete(logger, existing, principal, store, false)
		if err != nil {
			return nil, fmt.Errorf("error deleting MTO common solution system owner: user lacks permissions: %w", err)
		}

		// Finally, delete the system owner
		returnedSystemOwner, err := storage.MTOCommonSolutionSystemOwnerDeleteByID(tx, principalAccount.ID, logger, id)
		if err != nil {
			return nil, fmt.Errorf("unable to delete mto system owner. Err %w", err)
		}
		return returnedSystemOwner, nil
	})
	if err != nil {
		return nil, err
	}

	// TODO add delete email here

	return returnedSystemOwner, nil
}

// GetMTOCommonSolutionSystemOwner retrieves a system owner for a common solution by its ID.
// Returns the system owner if found, or an error if not found or on failure.
func GetMTOCommonSolutionSystemOwner(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.MTOCommonSolutionSystemOwner, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	systemOwner, err := loaders.MTOCommonSolutionSystemOwner.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get system owner with id %s: %w", id, err)
	}

	return systemOwner, nil
}
