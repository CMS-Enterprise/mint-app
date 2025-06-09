package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCommonSolutionContactInformationGetByKeyLOADER returns an MTOCommonSolutionContactInformation by its key.
// This function loads all points of contact for a given common solution key. It does not provide contextual data.
func MTOCommonSolutionContactInformationGetByKeyLOADER(ctx context.Context, key models.MTOCommonSolutionKey) (*models.MTOCommonSolutionContactInformation, error) {
	pocs, err := loaders.MTOCommonSolutionContact.ByCommonSolutionKey.Load(ctx, key)
	logger := appcontext.ZLogger(ctx)

	if err != nil {
		logger.Error("failed to load MTOCommonSolutionContact by key", zap.Error(err), zap.String("key", string(key)))
		return &models.MTOCommonSolutionContactInformation{}, nil //don't want to break the call when no contact is set for something
	}

	return &models.MTOCommonSolutionContactInformation{
		PointsOfContact: pocs,
	}, nil
}

// CreateMTOCommonSolutionUserContact creates a new user contact for a common solution.
// It looks up the user account by username and inserts a new contact record associated with that user.
func CreateMTOCommonSolutionUserContactUser(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	key models.MTOCommonSolutionKey,
	userName string,
	isTeam bool,
	role *string,
	receiveEmails bool,
	isPrimary bool,
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	userAccount, err := UserAccountGetByUsername(logger, store, userName)
	if err != nil {
		return nil, fmt.Errorf("failed to get user account by username %s: %w", userName, err)
	}

	userContact := models.NewMTOCommonSolutionContact(
		principalAccount.ID,
		key,
		userAccount.Username, // Using the user's name and email as mailboxTitle and mailboxAddress to support email sending logic
		userAccount.Email,
		userAccount,
		isTeam,
		role,
		isPrimary,
		receiveEmails,
	)

	newContact, err := storage.MTOCommonSolutionCreateContact(
		store,
		logger,
		userContact,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create contact for user %s: %w", userName, err)
	}

	// newContact.UserAccount = userAccount
	return newContact, nil
}

// CreateMTOCommonSolutionContactMailbox creates a new team mailbox contact for a common solution.
// It inserts a new contact record with the provided mailbox title and address, not linked to a user account.
func CreateMTOCommonSolutionContactMailbox(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	key models.MTOCommonSolutionKey,
	mailboxTitle *string,
	mailboxAddress string,
	isTeam bool,
	role *string,
	receiveEmails bool,
	isPrimary bool,
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	userContact := models.NewMTOCommonSolutionContact(
		principalAccount.ID,
		key,
		mailboxTitle,
		mailboxAddress,
		nil,
		isTeam,
		role,
		isPrimary,
		receiveEmails,
	)

	return storage.MTOCommonSolutionCreateContact(
		store,
		logger,
		userContact,
	)
}

// UpdateMTOCommonSolutionContact updates an existing user or mailbox contact for a common solution.
// Only role, isPrimary, and receiveEmails fields can be changed. Returns the updated contact.
func UpdateMTOCommonSolutionContact(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existing_contact, err := storage.MTOCommonSolutionGetContactByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contact with id %s: %w", id, err)
	}
	if existing_contact == nil {
		return nil, fmt.Errorf("contact with id %s not found", id)
	}

	err = BaseStructPreUpdate(logger, existing_contact, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	updatedContact, err := storage.MTOCommonSolutionUpdateContact(store, logger, existing_contact)
	if err != nil {
		return nil, fmt.Errorf("failed to update contact with id %s: %w", id, err)
	}

	return updatedContact, nil
}

// DeleteMTOCommonSolutionContact deletes a contact for a common solution by its ID.
// Returns the deleted contact or an error.
func DeleteMTOCommonSolutionContact(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existing := &models.MTOCommonSolutionContact{}

	// Use a transaction for delete (for audit triggers, etc.)
	err := sqlutils.WithTransactionNoReturn(store, func(tx *sqlx.Tx) error {
		// Fetch the existing contact to check permissions and return after delete
		var err error
		existing, err = storage.MTOCommonSolutionGetContactByID(store, logger, id)
		if err != nil {
			return fmt.Errorf("failed to get contact with id %s: %w", id, err)
		}

		if existing == nil {
			return fmt.Errorf("contact with id %s not found", id)
		}

		// Check permissions
		err = BaseStructPreDelete(logger, existing, principal, store, false)
		if err != nil {
			return fmt.Errorf("error deleting contact. user doesn't have permissions. %s", err)
		}

		// Finally, delete the contact
		if err := storage.MTOCommonSolutionDeleteContactByID(tx, principalAccount.ID, logger, id); err != nil {
			return fmt.Errorf("unable to delete contact. Err %w", err)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return existing, nil
}

// GetMTOCommonSolutionUserContact retrieves a contact for a common solution by its ID.
// Returns the contact if found, or an error if not found or on failure.
func GetMTOCommonSolutionUserContact(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	contact, err := storage.MTOCommonSolutionGetContactByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contact with id %s: %w", id, err)
	}

	if contact == nil {
		return nil, fmt.Errorf("contact with id %s not found", id)
	}

	return contact, nil
}
