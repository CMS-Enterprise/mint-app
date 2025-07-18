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
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	key models.MTOCommonSolutionKey,
	contractorTitle *string,
	contractorName string,
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	contractor := models.NewMTOCommonSolutionContractor(
		principalAccount.ID,
		key,
		contractorTitle,
		contractorName,
	)

	returnedContractor, err := storage.MTOCommonSolutionCreateContractor(
		store,
		logger,
		contractor,
	)
	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		// Load the MTOCommonSolution to get its name for the email
		mtoSolution, err := MTOCommonSolutionGetByKeyLOADER(ctx, returnedContractor.Key)
		if err != nil {
			return nil, err
		}

		// Send welcome email to new POC
		go func() {
			sendEmailErr := sendContractorAddedEmail(
				emailService,
				emailTemplateService,
				addressBook,
				returnedContractor,
				mtoSolution.Name,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by user account",
					zap.String("key", string(key)),
					zap.String("contractor name", returnedContractor.ContractorName),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return returnedContractor, nil
}

// UpdateMTOCommonSolutionContractor updates an existing contractor for a common solution.
// Accepts the contractor ID and a map of changes. Returns the updated contractor or an error.
func UpdateMTOCommonSolutionContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
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

	if emailService != nil && emailTemplateService != nil {
		// Load the MTOCommonSolution to get its name for the email
		mtoSolution, err := MTOCommonSolutionGetByKeyLOADER(ctx, updatedContractor.Key)
		if err != nil {
			return nil, err
		}

		// Send welcome email to new POC
		go func() {
			sendEmailErr := sendContractorEditedEmail(
				emailService,
				emailTemplateService,
				addressBook,
				updatedContractor,
				mtoSolution.Name,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by user account",
					zap.String("key", string(updatedContractor.Key)),
					zap.String("contractor name", updatedContractor.ContractorName),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return updatedContractor, nil
}

// DeleteMTOCommonSolutionContractor deletes a contractor for a common solution by its ID.
// Returns the deleted contractor or an error.
func DeleteMTOCommonSolutionContractor(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService, emailTemplateService email.TemplateService, addressBook email.AddressBook,
	id uuid.UUID,
) (*models.MTOCommonSolutionContractor, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	// Write up a transaction since storage.MTOSolutionDelete needs one for setting `delete` session user variables
	returnedContractor, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOCommonSolutionContractor, error) {
		// First, fetch the existing solution so we can check permissions
		existing, err := loaders.MTOCommonSolutionContractor.ByID.Load(ctx, id)
		if err != nil {
			logger.Warn("Failed to get contractor with id", zap.Any("contractorId", id), zap.Error(err))
			return nil, nil
		}

		if existing == nil {
			return nil, fmt.Errorf("contractor with id %s not found", id)
		}

		// Check permissions
		err = BaseStructPreDelete(logger, existing, principal, store, false)
		if err != nil {
			return nil, fmt.Errorf("error deleting mto solution. user doesnt have permissions. %s", err)
		}

		// Finally, delete the contractor
		returnedContractor, err := storage.MTOCommonSolutionDeleteContractorByID(tx, principalAccount.ID, logger, id)
		if err != nil {
			return nil, fmt.Errorf("unable to delete mto contractor. Err %w", err)
		}
		return returnedContractor, nil
	})
	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		// Load the MTOCommonSolution to get its name for the email
		mtoSolution, err := MTOCommonSolutionGetByKeyLOADER(ctx, returnedContractor.Key)
		if err != nil {
			return nil, err
		}

		// Send welcome email to new POC
		go func() {
			sendEmailErr := sendContractorRemovedEmail(
				emailService,
				emailTemplateService,
				addressBook,
				returnedContractor,
				mtoSolution.Name,
			)
			if sendEmailErr != nil {
				logger.Error(
					"failed to send point of contact welcome email for create by user account",
					zap.String("key", string(returnedContractor.Key)),
					zap.String("contractor name", returnedContractor.ContractorName),
					zap.Error(sendEmailErr),
				)
			}
		}()
	}

	return returnedContractor, nil
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

func sendContractorAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionContractorAddedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.ContractorAddedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewContractorAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
	)

	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
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

func sendContractorEditedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionContractorEditedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.ContractorEditedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewContractorEditedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
	)

	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
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

func sendContractorRemovedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionContractorRemovedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.ContractorRemovedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewContractorRemovedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
	)

	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
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
