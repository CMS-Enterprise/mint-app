package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
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

// OperationaSolutionsAndPossibleGetByOPNeedIDLOADER returns operational Solutions and possible Operational Solutions based on a specific operational Need ID using a Data Loader
func OperationaSolutionsAndPossibleGetByOPNeedIDLOADER(ctx context.Context, operationalNeedID uuid.UUID, includeNotNeeded bool) ([]*models.OperationalSolution, error) {
	allLoaders := loaders.Loaders(ctx)
	opSolutionLoader := allLoaders.OperationSolutionLoader

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

	/* TODO: SW

	Data Needed
	1. Model Name
	2. Solution Name (from the possible operational solution...)
	3. Model Status
	4. Model Start Date
	5. Operational Need Name
	6. Solution Status
	7. Information to link to the specific solution in MINT
	*/
	// TODO: Get data --> send email
	opNeed, err := OperationalNeedGetByID(logger, operationalSolution.OperationalNeedID, store) // TODO: if desired this could be a data loader as well
	if err != nil {
		return err
	}
	modelPlan, err := ModelPlanGetByIDLOADER(ctx, opNeed.ModelPlanID) //TODO: SW add context to this function call so we can use the data loader..
	// modelPlan, err := ModelPlanGetByID(logger, opNeed.ModelPlanID, store)
	if err != nil {
		return err
	}
	posSol, err := store.PossibleOperationalSolutionGetByID(logger, *operationalSolution.SolutionType)
	if err != nil {
		return err
	}
	pocEmailAddress := []string{}
	modelLeadNames := []string{}
	filterViewLink := "TODO: SW" + posSol.Name // TODO add filterview to the possible solution table.

	err = sendSolutionSelectedForUseByModelEmail(
		emailService,
		emailTemplateService,
		addressBook,
		operationalSolution,
		opNeed,
		modelPlan,
		pocEmailAddress,
		modelLeadNames,
		filterViewLink,
	)

	return err
}

// sendSolutionSelectedForUseByModelEmail parses the provided data into content for an email, and sends the email.
func sendSolutionSelectedForUseByModelEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	solution *models.OperationalSolution,
	need *models.OperationalNeed,
	modelPlan *models.ModelPlan,
	pocEmailAddress []string,
	modelLeadNames []string,
	filterViewLink string,
) error {
	// TODO: SW, extract the logic from func sendPlanDiscussionTagEmails to obfuscu

	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.SolutionSelectedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.SolutionSelectedSubjectContent{
		ModelName:    modelPlan.ModelName,
		SolutionName: models.ValueOrEmpty(solution.Name),
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.SolutionSelectedBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		FilterViewLink:    filterViewLink,
		SolutionName:      models.ValueOrEmpty(solution.Name),
		SolutionStatus:    string(solution.Status),
		NeedName:          models.ValueOrEmpty(need.Name),
		ModelLeadNames:    modelLeadNames,
		ModelName:         modelPlan.ModelName,
		ModelAbbreviation: models.ValueOrEmpty(modelPlan.Abbreviation),

		ModelStatus: string(modelPlan.Status),
	})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, pocEmailAddress, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	if err != nil {
		return err
	}

	return nil
}
