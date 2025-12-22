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
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// CreateKeyContactUser creates a new user contact for a subject matter expert.
// It looks up the user account by username and inserts a new contact record associated with that user.
func CreateKeyContactUser(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	userName string,
	subjectArea string,
	subjectCategoryID uuid.UUID,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.KeyContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	userAccount, err := userhelpers.GetOrCreateUserAccount(ctx, store, store, userName, false, false, getAccountInformation)
	if err != nil {
		return nil, fmt.Errorf("failed to get user account by username %s: %w", userName, err)
	}

	userContact := models.NewKeyContact(
		principalAccount.ID,
		nil,
		nil,
		&userAccount.ID,
		subjectArea,
		subjectCategoryID,
	)

	newContact, err := storage.KeyContactCreateContact(
		store,
		logger,
		userContact,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create contact for user %s: %w", userName, err)
	}

	if emailService != nil && emailTemplateService != nil && newContact.Email != nil {
		// Send welcome email to new key contact
		go func() {
			sendEmailErr := sendKeyContactWelcomeEmail(
				ctx,
				emailService,
				emailTemplateService,
				addressBook,
				newContact,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send key contact welcome email for create by user account",
					zap.String("username", userName),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return newContact, nil
}

// CreateKeyContactMailbox creates a new team mailbox contact for a subject matter expert.
// It inserts a new contact record with the provided mailbox title and address, not linked to a user account.
func CreateKeyContactMailbox(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	mailboxTitle string,
	mailboxAddress string,
	subjectArea string,
	subjectCategoryID uuid.UUID,
) (*models.KeyContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	mailboxContact := models.NewKeyContact(
		principalAccount.ID,
		&mailboxTitle,
		&mailboxAddress,
		nil,
		subjectArea,
		subjectCategoryID,
	)

	newContact, err := storage.KeyContactCreateContact(
		store,
		logger,
		mailboxContact,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create contact for mailbox %s: %w", mailboxAddress, err)
	}

	if emailService != nil && emailTemplateService != nil && newContact.Email != nil {
		go func() {
			sendEmailErr := sendKeyContactWelcomeEmail(
				ctx,
				emailService,
				emailTemplateService,
				addressBook,
				newContact,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send key contact welcome email for create by mailbox",
					zap.String("mailboxAddress", mailboxAddress),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return newContact, nil
}

// UpdateKeyContact updates an existing user or mailbox contact for a subject matter expert.
// Only subjectCategoryID, subjectArea, and mailboxTitle fields can be changed. Returns the updated contact.
func UpdateKeyContact(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.KeyContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existingContact, err := GetKeyContact(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contact with id %s: %w", id, err)
	}
	if existingContact == nil {
		return nil, fmt.Errorf("contact with id %s not found", id)
	}

	err = BaseStructPreUpdate(logger, existingContact, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	updatedContact, err := storage.KeyContactUpdateContact(store, logger, existingContact)
	if err != nil {
		return nil, fmt.Errorf("failed to update contact with id %s: %w", id, err)
	}

	return updatedContact, nil
}

// DeleteKeyContact deletes a subject matter expert by its ID.
// Returns the deleted contact or an error.
func DeleteKeyContact(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.KeyContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Use a transaction for delete (for audit triggers, etc.)
	returnedContact, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.KeyContact, error) {
		// Fetch the existing contact to check permissions and return after delete
		existing, err := GetKeyContact(ctx, id)
		if err != nil {
			logger.Warn("Failed to get contact with id", zap.Any("contactId", id), zap.Error(err))
			return nil, nil
		}

		if existing == nil {
			return nil, fmt.Errorf("contact with id %s not found", id)
		}

		// Check permissions
		err = BaseStructPreDelete(logger, existing, principal, store, false)
		if err != nil {
			return nil, fmt.Errorf("error deleting contact. user doesn't have permissions. %s", err)
		}

		// Finally, delete the contact
		returnedContact, err := storage.KeyContactDeleteContactByID(tx, principalAccount.ID, logger, id)

		if err != nil {
			return nil, fmt.Errorf("unable to delete contact. Err %w", err)
		}
		return returnedContact, nil
	})

	if err != nil {
		return nil, err
	}

	return returnedContact, nil
}

// GetKeyContact retrieves a subject matter expert by its ID.
// Returns the contact if found, or an error if not found or on failure.
func GetKeyContact(ctx context.Context, id uuid.UUID) (*models.KeyContact, error) {
	contact, err := loaders.KeyContact.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contact with id %s: %w", id, err)
	}

	if contact == nil {
		return nil, fmt.Errorf("contact with id %s not found", id)
	}

	return contact, nil
}

// GetKeyContacts retrieves all subject matter experts.
// Returns the contacts if found, or an error if failure.
func GetAllKeyContacts(ctx context.Context) ([]*models.KeyContact, error) {
	contacts, err := loaders.KeyContact.GetAll.Load(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get all key contacts: %w", err)
	}

	if contacts == nil {
		contacts = []*models.KeyContact{}
	}

	return contacts, nil
}

func sendKeyContactWelcomeEmail(
	ctx context.Context,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.KeyContact,
) error {
	category, err := loaders.KeyContactCategory.ByID.Load(ctx, contact.SubjectCategoryID)
	if err != nil {
		return err
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.KeyContactWelcomeTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.NewKeyContactAddedSubjectContent(*contact))
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.NewKeyContactAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
		*category,
	))
	if err != nil {
		return err
	}

	if contact.Email != nil {
		err = emailService.Send(
			addressBook.DefaultSender,
			[]string{*contact.Email},
			nil,
			emailSubject,
			"text/html",
			emailBody,
		)
		if err != nil {
			return err
		}
	}

	return nil
}
