package resolvers

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// ModelPlanCreate implements resolver logic to create a model plan
// TODO Revist this function, as we probably want to add all of these DB entries inthe scope of a single SQL transaction
// so that we can roll back if there is an error with any of these calls.
func ModelPlanCreate(
	ctx context.Context,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	modelName string,
	store *storage.Store,
	principal authentication.Principal,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.ModelPlan, error) {
	plan := models.NewModelPlan(principal.Account().ID, modelName)

	err := BaseStructPreCreate(logger, plan, principal, store, false) //We don't check access here, because the user can't yet be a collaborator. Collaborators are created after ModelPlan initiation.
	if err != nil {
		return nil, err
	}

	// Create the model plan itself
	createdPlan, err := store.ModelPlanCreate(logger, plan)
	if err != nil {
		return nil, err
	}
	userAccount := principal.Account()

	// Create an initial collaborator for the plan
	_, _, err = CreatePlanCollaborator(
		ctx,
		logger,
		nil,
		nil,
		&model.PlanCollaboratorCreateInput{
			ModelPlanID: plan.ID,
			UserName:    *userAccount.Username,
			TeamRole:    models.TeamRoleModelLead,
		},
		principal,
		store,
		false,
		getAccountInformation,
	)
	if err != nil {
		return nil, err
	}

	baseTaskListUser := models.NewBaseTaskListSection(userAccount.ID, createdPlan.ID)

	// Create a default plan basics object
	basics := models.NewPlanBasics(baseTaskListUser)

	_, err = store.PlanBasicsCreate(logger, basics)
	if err != nil {
		return nil, err
	}

	// Create a default plan general characteristics object
	generalCharacteristics := models.NewPlanGeneralCharacteristics(baseTaskListUser)

	_, err = store.PlanGeneralCharacteristicsCreate(logger, generalCharacteristics)
	if err != nil {
		return nil, err
	}
	// Create a default Plan Beneficiares object
	beneficiaries := models.NewPlanBeneficiaries(baseTaskListUser)

	_, err = store.PlanBeneficiariesCreate(logger, beneficiaries)
	if err != nil {
		return nil, err
	}
	//Create a default Plan Participants and Providers object
	participantsAndProviders := models.NewPlanParticipantsAndProviders(baseTaskListUser)

	_, err = store.PlanParticipantsAndProvidersCreate(logger, participantsAndProviders)
	if err != nil {
		return nil, err
	}

	//Create default Plan OpsEvalAndLearning object
	opsEvalAndLearning := models.NewPlanOpsEvalAndLearning(baseTaskListUser)

	_, err = store.PlanOpsEvalAndLearningCreate(logger, opsEvalAndLearning)
	if err != nil {
		return nil, err
	}

	//Create default PlanPayments object
	planPayments := models.NewPlanPayments(baseTaskListUser)

	_, err = store.PlanPaymentsCreate(logger, planPayments)
	if err != nil {
		return nil, err
	}

	//Create default Operational Needs
	_, err = store.OperationalNeedInsertAllPossible(logger, createdPlan.ID, principal.Account().ID)
	if err != nil {
		return nil, err
	}

	if emailService != nil && emailTemplateService != nil {
		err = sendModelPlanCreatedEmail(
			ctx,
			emailService,
			emailTemplateService,
			emailService.GetConfig().GetDevTeamEmail(),
			createdPlan,
		)
		if err != nil {
			return nil, err
		}
	}

	return createdPlan, err
}

func sendModelPlanCreatedEmail(
	ctx context.Context,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	receiverEmail string,
	modelPlan *models.ModelPlan,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.ModelPlanCreatedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.ModelPlanCreatedSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanCreatedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		UserName:      modelPlan.CreatedByUserAccount(ctx).CommonName,
	})
	if err != nil {
		return err
	}

	err = emailService.Send(emailService.GetConfig().GetDefaultSender(), []string{receiverEmail}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}

// ModelPlanUpdate implements resolver logic to update a model plan
func ModelPlanUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.ModelPlan, error) {
	// Get existing plan
	existingPlan, err := store.ModelPlanGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingPlan, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	retPlan, err := store.ModelPlanUpdate(logger, existingPlan)
	if err != nil {
		return nil, err
	}
	return retPlan, err

}

// ModelPlanGetByID implements resolver logic to get a model plan by its ID
func ModelPlanGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.ModelPlan, error) {
	plan, err := store.ModelPlanGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	return plan, nil
}

// ModelPlanGetSampleModel returns the sample model plan
func ModelPlanGetSampleModel(logger *zap.Logger, store *storage.Store) (*models.ModelPlan, error) {
	plan, err := store.ModelPlanGetByName(logger, constants.SampleModelName)
	if err != nil {
		return nil, err
	}

	return plan, nil
}

// ModelPlanCollection implements resolver logic to get a list of model plans by who's a collaborator on them (TODO)
func ModelPlanCollection(logger *zap.Logger, principal authentication.Principal, store *storage.Store, filter model.ModelPlanFilter) ([]*models.ModelPlan, error) {
	var modelPlans []*models.ModelPlan
	var err error
	switch filter {
	case model.ModelPlanFilterIncludeAll:
		modelPlans, err = store.ModelPlanCollection(logger, false)
	case model.ModelPlanFilterCollabOnly:
		modelPlans, err = store.ModelPlanCollectionCollaboratorOnly(logger, false, principal.Account().ID)
	case model.ModelPlanFilterWithCrTdls:
		modelPlans, err = store.ModelPlanCollectionWithCRTDLS(logger, false)
	default:
		modelPlans = nil
		err = fmt.Errorf("model plan filter not defined for filter: %s", filter)
	}

	return modelPlans, err
}

// ModelPlanNameHistory returns a slice of AuditChanges, with the only values returned being the model_name field
func ModelPlanNameHistory(logger *zap.Logger, modelPlanID uuid.UUID, sortDir models.SortDirection, store *storage.Store) ([]string, error) {
	fieldName := "model_name"

	changes, err := store.AuditChangeCollectionByIDAndTableAndField(logger, "model_plan", modelPlanID, fieldName, sortDir)
	nameHistory := make([]string, len(changes)) // more efficient than appending
	for i := 0; i < len(changes); i++ {

		nameField := changes[i].Fields[fieldName]
		name := fmt.Sprintf("%s", nameField.New)

		nameHistory[i] = name

	}
	if err != nil {
		return nil, err
	}

	return nameHistory, nil
}
