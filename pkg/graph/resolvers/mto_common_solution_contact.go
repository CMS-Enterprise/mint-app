package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// MTOCommonSolutionContactInformationGetByKeyLOADER returns an MTOCommonSolutionContactInformation by its key.
// This function loads all points of contact for a given common solution key. It does not provide contextual data.
func MTOCommonSolutionContactInformationGetByKeyLOADER(ctx context.Context, key models.MTOCommonSolutionKey) (*models.MTOCommonSolutionContactInformation, error) {
	pocs, err := loaders.MTOCommonSolutionContact.ByCommonSolutionKey.Load(ctx, key)
	logger := appcontext.ZLogger(ctx)

	if err != nil {
		logger.Error("failed to load MTOCommonSolutionContact by key", zap.Error(err), zap.String("key", string(key)))
		return nil, nil //don't want to break the call when no contact is set for something
	}

	return &models.MTOCommonSolutionContactInformation{
		PointsOfContact: pocs,
	}, nil
}

// CreateMTOCommonSolutionContactUser creates a new user contact for a common solution.
// It looks up the user account by username and inserts a new contact record associated with that user.
func CreateMTOCommonSolutionContactUser(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	key models.MTOCommonSolutionKey,
	userName string,
	isTeam bool,
	role *string,
	receiveEmails bool,
	isPrimary bool,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	userAccount, err := userhelpers.GetOrCreateUserAccount(ctx, store, store, userName, false, false, getAccountInformation)
	if err != nil {
		return nil, fmt.Errorf("failed to get user account by username %s: %w", userName, err)
	}

	userContact := models.NewMTOCommonSolutionContact(
		principalAccount.ID,
		key,
		nil,
		nil,
		&userAccount.ID,
		false,
		role,
		isPrimary,
		receiveEmails,
	)

	err = BaseStructPreCreate(logger, userContact, principal, store, false)
	if err != nil {
		return nil, err
	}

	newContact, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOCommonSolutionContact, error) {
		newContact, err := storage.MTOCommonSolutionCreateContact(
			tx,
			logger,
			userContact,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to create contact for user %s: %w", userName, err)
		}

		// Update isPrimary on other rows if needed
		if newContact.IsPrimary {
			// Need modifiedBy for unset primary update
			userID := principal.Account().ID
			newContact.ModifiedBy = &userID

			err = storage.MTOCommonSolutionContactUnsetPrimaryContactByKey(tx, logger, newContact)

			if err != nil {
				return nil, err
			}
		}

		return newContact, nil
	})

	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		// Send welcome email to new POC
		go func() {
			sendEmailErr := sendSolutionContactWelcomeEmail(
				emailService,
				emailTemplateService,
				addressBook,
				newContact,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by user account",
					zap.String("key", string(key)),
					zap.String("username", userName),
					zap.Error(sendEmailErr),
				)
			}
		}()
		// Send info email to MINT mailbox
		go func() {
			sendEmailErr := sendSolutionContactMintMailboxPOCAdded(
				emailService,
				emailTemplateService,
				addressBook,
				newContact,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by user account",
					zap.String("key", string(key)),
					zap.String("username", userName),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return newContact, nil
}

// CreateMTOCommonSolutionContactMailbox creates a new team mailbox contact for a common solution.
// It inserts a new contact record with the provided mailbox title and address, not linked to a user account.
func CreateMTOCommonSolutionContactMailbox(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
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

	mailboxContact := models.NewMTOCommonSolutionContact(
		principalAccount.ID,
		key,
		mailboxTitle,
		&mailboxAddress,
		nil,
		true,
		role,
		isPrimary,
		receiveEmails,
	)

	err := BaseStructPreCreate(logger, mailboxContact, principal, store, false)
	if err != nil {
		return nil, err
	}

	newContact, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOCommonSolutionContact, error) {
		newContact, err := storage.MTOCommonSolutionCreateContact(
			tx,
			logger,
			mailboxContact,
		)

		if err != nil {
			return nil, err
		}

		// Update isPrimary on other rows if needed
		if newContact.IsPrimary {
			// Need modifiedBy for unset primary update
			userID := principal.Account().ID
			newContact.ModifiedBy = &userID
			err = storage.MTOCommonSolutionContactUnsetPrimaryContactByKey(tx, logger, newContact)

			if err != nil {
				return nil, err
			}
		}

		return newContact, nil
	})

	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		go func() {
			sendEmailErr := sendSolutionContactWelcomeEmail(
				emailService,
				emailTemplateService,
				addressBook,
				newContact,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by mailbox",
					zap.String("key", string(key)),
					zap.String("mailboxAddress", mailboxAddress),
					zap.Error(sendEmailErr),
				)
			}
		}()
		// Send info email to MINT mailbox
		go func() {
			sendEmailErr := sendSolutionContactMintMailboxPOCAdded(
				emailService,
				emailTemplateService,
				addressBook,
				newContact,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by mailbox",
					zap.String("key", string(key)),
					zap.String("mailboxAddress", mailboxAddress),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return newContact, nil
}

// UpdateMTOCommonSolutionContact updates an existing user or mailbox contact for a common solution.
// Only role, isPrimary, and receiveEmails fields can be changed. Returns the updated contact.
func UpdateMTOCommonSolutionContact(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existingContact, err := loaders.MTOCommonSolutionContact.ByID.Load(ctx, id)
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

	updatedContact, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOCommonSolutionContact, error) {
		updatedContact, err := storage.MTOCommonSolutionUpdateContact(tx, logger, existingContact)
		if err != nil {
			return nil, fmt.Errorf("failed to update contact with id %s: %w", id, err)
		}

		// Update isPrimary on other rows if needed
		if existingContact.IsPrimary {
			err = storage.MTOCommonSolutionContactUnsetPrimaryContactByKey(tx, logger, existingContact)

			if err != nil {
				return nil, err
			}
		}

		return updatedContact, nil
	})
	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		go func() {
			sendEmailErr := sendSolutionContactMintMailboxPOCEdited(
				emailService,
				emailTemplateService,
				addressBook,
				updatedContact,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by user account",
					zap.String("key", string(updatedContact.Key)),
					zap.String("username", updatedContact.Name),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return updatedContact, nil
}

// DeleteMTOCommonSolutionContact deletes a contact for a common solution by its ID.
// Returns the deleted contact or an error.
func DeleteMTOCommonSolutionContact(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	id uuid.UUID,
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Use a transaction for delete (for audit triggers, etc.)
	returnedContact, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOCommonSolutionContact, error) {
		// Fetch the existing contact to check permissions and return after delete
		existing, err := loaders.MTOCommonSolutionContact.ByID.Load(ctx, id)
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
		returnedContact, err := storage.MTOCommonSolutionDeleteContactByID(tx, principalAccount.ID, logger, id)

		if err != nil {
			return nil, fmt.Errorf("unable to delete contact. Err %w", err)
		}
		return returnedContact, nil
	})
	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		go func() {
			sendEmailErr := sendSolutionContactMintMailboxPOCRemoved(
				emailService,
				emailTemplateService,
				addressBook,
				returnedContact,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by user account",
					zap.String("key", string(returnedContact.Key)),
					zap.String("username", returnedContact.Name),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return returnedContact, nil
}

// GetMTOCommonSolutionContact retrieves a contact for a common solution by its ID.
// Returns the contact if found, or an error if not found or on failure.
func GetMTOCommonSolutionContact(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
) (*models.MTOCommonSolutionContact, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	contact, err := loaders.MTOCommonSolutionContact.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get contact with id %s: %w", id, err)
	}

	if contact == nil {
		return nil, fmt.Errorf("contact with id %s not found", id)
	}

	return contact, nil
}

func sendSolutionContactWelcomeEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionPOCWelcomeTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.AddedAsPointOfContactSubjectContent{
		SolutionAcronym: string(contact.Key),
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.NewAddedAsPointOfContactBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
	))
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{contact.Email},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}
	return nil
}

func sendSolutionContactMintMailboxPOCAdded(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	var emailTemplate *emailtemplates.EmailTemplate
	var err error
	if contact.IsPrimary {
		emailTemplate, err = emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionOwnerAddedTemplateName)
	} else {
		emailTemplate, err = emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionPOCAddedTemplateName)
	}
	if err != nil {
		return err
	}

	var emailSubject string
	if contact.IsPrimary {
		emailSubject, err = emailTemplate.GetExecutedSubject(email.SystemOwnerAddedSubjectContent{
			SolutionAcronym: string(contact.Key),
		})
	} else {
		emailSubject, err = emailTemplate.GetExecutedSubject(email.PointOfContactAddedSubjectContent{
			SolutionAcronym: string(contact.Key),
		})
	}
	if err != nil {
		return err
	}

	var emailBody string
	if contact.IsPrimary {
		emailBody, err = emailTemplate.GetExecutedBody(email.NewSystemOwnerAddedBodyContent(
			emailService.GetConfig().GetClientAddress(),
			*contact,
		))
	} else {
		emailBody, err = emailTemplate.GetExecutedBody(email.NewPointOfContactAddedBodyContent(
			emailService.GetConfig().GetClientAddress(),
			*contact,
		))
	}

	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}
	return nil
}

func sendSolutionContactMintMailboxPOCEdited(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	var emailTemplate *emailtemplates.EmailTemplate
	var err error
	if contact.IsPrimary {
		emailTemplate, err = emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionOwnerEditedTemplateName)
	} else {
		emailTemplate, err = emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionPOCEditedTemplateName)
	}
	if err != nil {
		return err
	}

	var emailSubject string
	if contact.IsPrimary {
		emailSubject, err = emailTemplate.GetExecutedSubject(email.SystemOwnerUpdatedSubjectContent{
			SolutionAcronym: string(contact.Key),
		})
	} else {
		emailSubject, err = emailTemplate.GetExecutedSubject(email.PointOfContactUpdatedSubjectContent{
			SolutionAcronym: string(contact.Key),
		})
	}
	if err != nil {
		return err
	}

	var emailBody string
	if contact.IsPrimary {
		emailBody, err = emailTemplate.GetExecutedBody(email.NewSystemOwnerUpdatedBodyContent(
			emailService.GetConfig().GetClientAddress(),
			*contact,
		))
	} else {
		emailBody, err = emailTemplate.GetExecutedBody(email.NewPointOfContactUpdatedBodyContent(
			emailService.GetConfig().GetClientAddress(),
			*contact,
		))
	}

	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}
	return nil
}

func sendSolutionContactMintMailboxPOCRemoved(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionPOCRemovedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.PointOfContactRemovedSubjectContent{
		SolutionAcronym: string(contact.Key),
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.NewPointOfContactRemovedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
	))
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{contact.Email},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}
	return nil
}
