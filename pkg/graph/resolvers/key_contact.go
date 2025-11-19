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
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// CreateKeyContactUser creates a new user contact for a key contact.
// It looks up the user account by username and inserts a new contact record associated with that user.
// ctx, logger, principal, r.store, userName, isTeam, subjectArea, subjectCategoryId
func CreateKeyContactUser(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	userName string,
	isTeam bool,
	subjectArea string,
	subjectCategoryId uuid.UUID,
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
		false,
		subjectArea,
		subjectCategoryId.String(),
	)

	err = BaseStructPreCreate(logger, userContact, principal, store, false)
	if err != nil {
		return nil, err
	}

	newContact, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.KeyContact, error) {
		newContact, err := storage.KeyContactCreateContact(
			tx,
			logger,
			userContact,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to create contact for user %s: %w", userName, err)
		}

		return newContact, nil
	})

	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		// Send welcome email to new key contact
		go func() {
			sendEmailErr := sendKeyContactWelcomeEmail(
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

func sendKeyContactWelcomeEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.KeyContact,
) error {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.KeyContactWelcomeTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.KeyContactAddedSubjectContent{})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.NewKeyContactAddedBodyContent(
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
