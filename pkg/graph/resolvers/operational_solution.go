package resolvers

import (
	"context"
	"slices"
	"strings"

	"github.com/google/uuid"
	"github.com/samber/lo"
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
	// go func() { // TODO: SW make this asyn
	sendEmailErr := sendSolutionSelectedEmails(ctx, store, logger, emailService, emailTemplateService, addressBook, sol)
	if sendEmailErr != nil {
		logger.Error("error sending solution selected emails",
			zap.String("solutionID", sol.ID.String()),
			zap.Error(sendEmailErr))
	}
	// }()
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
	basics, err := PlanBasicsGetByModelPlanIDLOADER(ctx, opNeed.ModelPlanID)
	if err != nil {
		return err
	}
	// TODO, can we make this more efficient? Need to do a DB call for each account. Will this block that data loader? Do we need another function?
	collaborators, err := PlanCollaboratorGetByModelPlanIDLOADER(ctx, opNeed.ModelPlanID)
	if err != nil {
		return err
	}
	leads := lo.Filter(collaborators, func(collab *models.PlanCollaborator, _ int) bool {
		return slices.Contains(collab.TeamRoles, string(models.TeamRoleModelLead))

	})
	leadNames := lo.Map(leads, func(lead *models.PlanCollaborator, _ int) string {
		account, err2 := UserAccountGetByIDLOADER(ctx, lead.UserID) // TODO: SW, maybe call a function directly if you pass a list of ids? this is synchronous
		if err2 != nil {
			return ""
		}
		return account.CommonName
	})
	pocs, err := PossibleOperationalSolutionContactsGetByPossibleSolutionID(ctx, posSol.ID)
	if err != nil {
		return err
	}
	pocEmailAddress, err := models.GetPOCEmailAddresses(pocs, emailService.GetConfig().GetSendTaggedPOCEmails(), addressBook.DevTeamEmail)
	if err != nil {
		return err
	}

	// pocEmailAddress := []string{"test@test.test"}
	modelLeadNames := leadNames
	filterViewLink := posSol.FilterView.ValueOrEmpty()

	modelStartDate := ""
	if basics.PerformancePeriodStarts != nil {
		modelStartDate = basics.PerformancePeriodStarts.String()
	}

	err = sendSolutionSelectedForUseByModelEmail(
		emailService,
		emailTemplateService,
		addressBook,
		models.ValueOrEmpty(operationalSolution.Name),
		operationalSolution.Status.Humanize(), // TODO: SW Verify the humanized Statuses
		models.ValueOrEmpty(opNeed.Name),
		modelPlan.ModelName,
		modelPlan.ID.String(),
		models.ValueOrEmpty(modelPlan.Abbreviation),
		modelPlan.Status.Humanize(),
		modelStartDate,
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
	solutionName string,
	solutionStatus string,
	needName string,
	modelPlanName string,
	modelPlanID string,
	modelAbbreviation string,
	modelStatus string,
	modelStartDate string,

	pocEmailAddress []string,
	modelLeadNames []string,
	filterView string,
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
		ModelName:    modelPlanName,
		SolutionName: solutionName,
	})
	if err != nil {
		return err
	}
	modelLeadJoin := strings.Join(modelLeadNames, ", ")

	emailBody, err := emailTemplate.GetExecutedBody(email.SolutionSelectedBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		FilterView:        filterView,
		SolutionName:      solutionName,
		SolutionStatus:    solutionStatus,
		ModelLeadNames:    modelLeadJoin,
		NeedName:          needName,
		ModelID:           modelPlanID,
		ModelName:         modelPlanName,
		ModelAbbreviation: modelAbbreviation,
		ModelStatus:       modelStatus,
		ModelStartDate:    modelStartDate, // TODO:SW use the correct data, this is
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
