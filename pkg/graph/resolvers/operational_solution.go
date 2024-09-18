package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// OperationalSolutionCreate calls a DB method to create an operational solution
func OperationalSolutionCreate(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	operationNeedID uuid.UUID,
	solutionType *models.OperationalSolutionKey,
	changes map[string]interface{},
	principal authentication.Principal,
) (*models.OperationalSolution, error) {
	opSol := models.NewOperationalSolution(principal.Account().ID, operationNeedID)

	err := BaseStructPreUpdate(logger, opSol, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	sol, err := store.OperationalSolutionInsert(logger, opSol, solutionType)
	if err != nil {
		return nil, err
	}

	// Send an email to the selected POCs
	go func() {
		sendEmailErr := sendSolutionSelectedEmails(ctx, store, logger, emailService, emailTemplateService, addressBook, sol)
		if sendEmailErr != nil {
			logger.Error("error sending solution selected emails",
				zap.String("solutionID", sol.ID.String()),
				zap.Error(sendEmailErr))
		}
	}()
	return sol, err

}

// OperationalSolutionUpdate updates an operational Solution by it's ID
func OperationalSolutionUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.OperationalSolution, error) {

	existing, err := store.OperationalSolutionGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}
	return store.OperationalSolutionUpdateByID(logger, existing)

}

// OperationalSolutionsAndPossibleGetByOPNeedIDLOADER returns operational Solutions and possible Operational Solutions based on a specific operational Need ID using a Data Loader
func OperationalSolutionsAndPossibleGetByOPNeedIDLOADER(ctx context.Context, operationalNeedID uuid.UUID, includeNotNeeded bool) ([]*models.OperationalSolution, error) {
	allLoaders := loaders.Loaders(ctx)
	opSolutionLoader := allLoaders.OperationalSolutionAndPossibleCollectionLoader

	key := loaders.NewKeyArgs()

	key.Args["include_not_needed"] = includeNotNeeded
	key.Args["operational_need_id"] = operationalNeedID

	thunk := opSolutionLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.OperationalSolution), nil
}

// OperationalSolutionGetByID returns an operational Solution by it's ID
func OperationalSolutionGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.OperationalSolution, error) {
	return store.OperationalSolutionGetByID(logger, id)
}

// OperationalSolutionGetByIDLOADER implements resolver logic to get an Operational Solution by ID using a data loader
func OperationalSolutionGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.OperationalSolution, error) {
	allLoaders := loaders.Loaders(ctx)
	opSolLoader := allLoaders.OperationalSolutionLoader
	key := loaders.NewKeyArgs()
	key.Args["id"] = id

	thunk := opSolLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.OperationalSolution), nil
}

// sendSolutionSelectedEmails gets the data and sends the emails for when a solution is selected
func sendSolutionSelectedEmails(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	operationalSolution *models.OperationalSolution,

) error {
	if emailService == nil || emailTemplateService == nil || operationalSolution == nil {
		return nil
	}
	if operationalSolution.IsOther == nil || *operationalSolution.IsOther { // Don't send an email for treat as other solutions
		logger.Info("operational solution is of the other type, no solution selected email being sent", zap.Any("solution", operationalSolution))
		return nil
	}
	solSelectedDB, err := store.GetSolutionSelectedDetails(operationalSolution.ID)
	if err != nil {
		return err
	}

	pocs, err := PossibleOperationalSolutionContactsGetByPossibleSolutionID(ctx, *operationalSolution.SolutionType)
	if err != nil {
		return err
	}
	if len(pocs) < 1 {
		logger.Info("operational solution doesn't have any defined points of contact, no solution selected email being sent", zap.Any("solution", operationalSolution))
		// Note, if we support this in the future, we potentially look at the solution POC information in the actual solution.
		return nil // Don't send an email if there aren't any recipients (Note, custom solutions do not have pocs configured in the db)
	}
	pocEmailAddress, err := models.GetPOCEmailAddresses(pocs, emailService.GetConfig().GetSendTaggedPOCEmails(), addressBook.DevTeamEmail)
	if err != nil {
		return err
	}

	err = sendSolutionSelectedForUseByModelEmail(
		emailService,
		emailTemplateService,
		addressBook,
		solSelectedDB,
		pocEmailAddress,
	)

	return err
}

// sendSolutionSelectedForUseByModelEmail parses the provided data into content for an email, and sends the email.
func sendSolutionSelectedForUseByModelEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	solutionSelectedDB *email.SolutionSelectedDB,
	pocEmailAddress []string,
) error {

	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.SolutionSelectedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.SolutionSelectedSubjectContent{
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
