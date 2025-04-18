package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/sqlutils"

	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// MTOSolutionUpdate updates the MTOSolution
func MTOSolutionUpdate(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
	milestoneLinks *model.MTOMilestoneLinks,
) (*models.MTOSolution, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := loaders.MTOSolution.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO Solution. Err %w", err)
	}
	// Since the above dataloader will return `Name` and `Type` properties when
	// fetching solutions sourced from the common solution library, we need to clear out those fields
	// or else storage.MTOSolutionUpdate will attempt to update them (which won't be allowed, since this is a Solution sourced from the common solution library
	if existing.AddedFromSolutionLibrary() {
		existing.Name = nil
		existing.Type = nil
	}

	// Check access and apply changes
	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOSolution, error) {
		updatedSolution, err := storage.MTOSolutionUpdate(tx, logger, existing)
		if err != nil {
			return nil, fmt.Errorf("failed to update solution: %w", err)
		}

		// Update linked milestones
		if milestoneLinks != nil && milestoneLinks.MilestoneIDs != nil {
			_, err := MTOSolutionLinkMilestonesWithTX(
				ctx,
				principal,
				logger,
				tx,
				updatedSolution.ID,
				milestoneLinks.MilestoneIDs,
			)
			if err != nil {
				return nil, fmt.Errorf("failed to update linked milestones: %w", err)
			}
		}

		return updatedSolution, nil
	})
}

// MTOSolutionCreateCustom uses the provided information to create a new MTOSolution
func MTOSolutionCreateCustom(
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	modelPlanID uuid.UUID,
	commonSolutionKey *models.MTOCommonSolutionKey,
	name string,
	solutionType models.MTOSolutionType,
	neededBy *time.Time,
	pocName string,
	pocEmail string,
) (*models.MTOSolution, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	mtoSolution := models.NewMTOSolution(
		modelPlanID,
		commonSolutionKey,
		&name,
		&solutionType,
		neededBy,
		principalAccount.ID,
	)
	mtoSolution.PocName = &pocName
	mtoSolution.PocEmail = &pocEmail

	err := BaseStructPreCreate(logger, mtoSolution, principal, store, true)
	if err != nil {
		return nil, err
	}

	return storage.MTOSolutionCreate(store, logger, mtoSolution)
}

func MTOSolutionCreateCommon(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlanID uuid.UUID,
	commonSolutionKey models.MTOCommonSolutionKey,
	milestonesToLink []uuid.UUID,
) (*models.MTOSolution, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Create a new MTOSolution object
	mtoSolution := models.NewMTOSolution(
		modelPlanID,
		&commonSolutionKey,
		nil, // name is not stored for a solution from the common library
		nil, // type is not stored for a solution from the common library
		nil, // neededBy is not provided when creating a custom solution. It must be updated later
		principalAccount.ID,
	)

	// Perform pre-create validations
	err := BaseStructPreCreate(logger, mtoSolution, principal, store, true)
	if err != nil {
		return nil, err
	}

	// Use a transaction for atomic operations
	retSol, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOSolution, error) {
		// Step 1: Create the solution
		solution, err := storage.MTOSolutionCreate(tx, logger, mtoSolution)
		if err != nil {
			return nil, fmt.Errorf("failed to create solution: %w", err)
		}

		// Step 2: Link milestones in a consolidated fashion
		if len(milestonesToLink) > 0 {
			_, err := MTOSolutionLinkMilestonesWithTX(ctx, principal, logger, tx, solution.ID, milestonesToLink)
			if err != nil {
				return nil, fmt.Errorf("failed to link milestones to solution: %w", err)
			}
		}

		return solution, nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create and link solutions: %w", err)
	}
	go func() {
		sendEmailErr := sendMTOSolutionSelectedEmails(ctx, store, logger, emailService, emailTemplateService, addressBook, retSol)
		if sendEmailErr != nil {
			logger.Error("error sending solution selected emails",
				zap.Any("solution", retSol.Key),
				zap.Error(sendEmailErr))
		}
	}()

	return retSol, nil
}

// MTOSolutionLinkMilestonesWithTX handles linking milestones to a solution in a single transaction
func MTOSolutionLinkMilestonesWithTX(
	ctx context.Context,
	principal authentication.Principal,
	logger *zap.Logger,
	tx *sqlx.Tx,
	solutionID uuid.UUID,
	milestonesToLink []uuid.UUID,
) ([]*models.MTOMilestone, error) {

	// Insert or update links in bulk
	linkedMilestones, err := storage.MTOMilestoneSolutionLinkMilestonesToSolution(tx, logger, solutionID, milestonesToLink, principal.Account().ID)
	if err != nil {
		logger.Error("failed to merge milestone links", zap.Error(err))
		return nil, err
	}

	return linkedMilestones, nil
}

// MTOSolutionsGetByModelPlanIDAndOptionalFilterView is a wrapper function
// that checks if the filterView is nil and calls the appropriate function
// to get MTO solutions by model plan ID.
func MTOSolutionsGetByModelPlanIDAndOptionalFilterView(ctx context.Context,
	milestoneID uuid.UUID,
	filterView *models.ModelViewFilter,
) ([]*models.MTOSolution, error) {
	if filterView == nil {
		return MTOSolutionGetByModelPlanIDLOADER(ctx, milestoneID)
	}
	return MTOSolutionsGetByModelPlanIDAndFilterView(ctx, milestoneID, *filterView)
}

// MTOSolutionsGetByModelPlanIDAndFilterView implements resolver logic to get all MTO solutions by a model plan ID and filter view
func MTOSolutionsGetByModelPlanIDAndFilterView(ctx context.Context,
	milestoneID uuid.UUID,
	filterView models.ModelViewFilter) ([]*models.MTOSolution, error) {
	return loaders.MTOSolution.ByModelPlanIDAndFilterView.Load(ctx, storage.MTOSolutionByModelPlanIDAndFilterViewKey{
		ModelPlanID: milestoneID,
		FilterView:  filterView,
	})

}

// MTOSolutionGetByModelPlanIDLOADER implements resolver logic to get all MTO solutions by a model plan ID using a data loader
func MTOSolutionGetByModelPlanIDLOADER(
	ctx context.Context,
	modelPlanID uuid.UUID,
) ([]*models.MTOSolution, error) {
	// TODO look into expanding this to also take contextual model plan data to return is added etc
	return loaders.MTOSolution.ByModelPlanID.Load(ctx, modelPlanID)
}

func MTOSolutionGetByMilestoneIDLOADER(
	ctx context.Context,
	milestoneID uuid.UUID,
) ([]*models.MTOSolution, error) {
	return loaders.MTOSolution.ByMilestoneID.Load(ctx, milestoneID)
}

func MTOSolutionGetByIDLOADER(
	ctx context.Context,
	id uuid.UUID,
) (*models.MTOSolution, error) {
	return loaders.MTOSolution.ByID.Load(ctx, id)
}

// MTOSolutionDelete deletes an MTOSolution
// It returns an error if the principal is invalid, the solution doesn't exist, user doesn't have permissions to delete, or the delete call itself fails
// TODO - Consider returning a *models.MTOSolution here if we want to ever access the returned data on what was deleted
func MTOSolutionDelete(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, id uuid.UUID) error {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Write up a transaction since storage.MTOSolutionDelete needs one for setting `delete` session user variables
	return sqlutils.WithTransactionNoReturn(store, func(tx *sqlx.Tx) error {
		// First, fetch the existing solution so we can check permissions
		existing, err := MTOSolutionGetByIDLOADER(ctx, id)
		if err != nil {
			return fmt.Errorf("error fetching mto solution during deletion: %s", err)
		}

		// Check permissions
		if err := BaseStructPreDelete(logger, existing, principal, store, true); err != nil {
			return fmt.Errorf("error deleting mto solution. user doesnt have permissions. %s", err)
		}

		// Finally, delete the solution
		if err := storage.MTOSolutionDelete(tx, principalAccount.ID, logger, id); err != nil {
			return fmt.Errorf("unable to delete mto solution. Err %w", err)
		}
		return nil
	})
}

// sendMTOSolutionSelectedEmails gets the data and sends the emails for when a solution is selected
func sendMTOSolutionSelectedEmails(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	solution *models.MTOSolution,

) error {
	if emailService == nil || emailTemplateService == nil || solution == nil {
		return nil
	}
	if solution.Key == nil {
		logger.Info(" this is a custom, no solution selected email being sent", zap.Any("solution", solution))
		return nil
	}
	//TODO, we might benefit from a dataloader since this is added in multiple places
	solSelectedDB, err := storage.GetMTOSolutionSelectedDetails(np, solution.ID)
	if err != nil {
		return err
	}

	pocInfo, err := MTOCommonSolutionContactInformationGetByKeyLOADER(ctx, *solution.Key)
	if err != nil {
		return err
	}

	if len(pocInfo.PointsOfContact) < 1 {
		logger.Info(" solution doesn't have any defined points of contact, no solution selected email being sent", zap.Any("solution", solution))
		// Note, if we support this in the future, we potentially look at the solution POC information in the actual solution.
		return nil // Don't send an email if there aren't any recipients (Note, custom solutions do not have pocs configured in the db)
	}

	//TODO
	// NOTE figma asks for the email to be sent to the POC in the to field, and all the others in the cc field.

	pocEmailAddress, err := pocInfo.EmailAddresses(emailService.GetConfig().GetSendTaggedPOCEmails(), addressBook.DevTeamEmail)
	if err != nil {
		return err
	}

	err = sendMTOSolutionSelectedForUseByModelEmail(
		emailService,
		emailTemplateService,
		addressBook,
		solSelectedDB,
		pocEmailAddress,
	)

	return err
}

// sendMTOSolutionSelectedForUseByModelEmail parses the provided data into content for an email, and sends the email.
func sendMTOSolutionSelectedForUseByModelEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	solutionSelectedDB *email.MTOSolutionSelectedDB,
	pocEmailAddress []string,
) error {

	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOSolutionSelectedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.OperationalSolutionSelectedSubjectContent{
		ModelName:    solutionSelectedDB.ModelName,
		SolutionName: solutionSelectedDB.SolutionName,
	})
	if err != nil {
		return err
	}
	bodyContent := solutionSelectedDB.ToSolutionSelectedBodyContent(emailService.GetConfig().GetClientAddress())

	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, pocEmailAddress, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}

	return nil
}
