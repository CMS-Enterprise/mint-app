package resolvers

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

// ModelPlanAnticipatedPhase calculates a suggested phase for a model plan based on its current status and timeline
// It uses a series of status evaluation strategies to determine the suggested phase
// If no phase is suggested, it returns nil
func ModelPlanAnticipatedPhase(
	store *storage.Store,
	modelStatus models.ModelStatus,
	modelPlanID uuid.UUID,
) (*model.PhaseSuggestion, error) {

	// If the model plan is paused or canceled, we shouldn't suggest a new phase
	if modelStatus == models.ModelStatusPaused || modelStatus == models.ModelStatusCanceled {
		return nil, nil
	}

	planBasics, err := store.PlanBasicsGetByModelPlanID(modelPlanID)
	if err != nil {
		return nil, err
	}

	suggestion, err := EvaluateSuggestedStatus(modelStatus, planBasics)
	if err != nil {
		return nil, err
	}

	return suggestion, nil
}

func EvaluateSuggestedStatus(modelStatus models.ModelStatus, planBasics *models.PlanBasics) (*model.PhaseSuggestion, error) {

	// Iterate over all status evaluation strategies and append valid statuses to the results slice
	statusEvaluationStrategies := GetAllStatusEvaluationStrategies()
	for _, strategy := range statusEvaluationStrategies {
		phaseSuggestion := strategy.Evaluate(modelStatus, planBasics)
		if nil != phaseSuggestion {
			return phaseSuggestion, nil
		}
	}

	return nil, nil
}

func ShouldSendEmailForPhaseSuggestion(
	currentPhaseSuggestion *model.PhaseSuggestion,
	previousSuggestedPhase *models.ModelPhase,
) bool {
	if currentPhaseSuggestion == nil {
		return false
	}

	if previousSuggestedPhase == nil {
		return true
	}

	if currentPhaseSuggestion.Phase == *previousSuggestedPhase {
		return false
	}

	return true
}

func SendEmailForPhaseSuggestion(
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook *email.AddressBook,
	currentPhaseSuggestion *model.PhaseSuggestion,
	modelPlan *models.ModelPlan,
) error {
	if !ShouldSendEmailForPhaseSuggestion(currentPhaseSuggestion, modelPlan.PreviousSuggestedPhase) {
		return nil
	}

	emailSubject, emailBody, err := ConstructPhaseSuggestionEmailTemplates(
		logger,
		emailService,
		emailTemplateService,
		modelPlan,
	)
	if err != nil {
		return err
	}

	emailRecipients, err := GetEmailsForModelPlanLeads(ctx, logger, store, modelPlan.ID)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		emailRecipients,
		nil,
		emailSubject,
		"text/html",
		emailBody,
		oddmail.WithBCC([]string{addressBook.MINTTeamEmail}),
	)
	if err != nil {
		err = fmt.Errorf("unable to send email for model plan id %s. Err %w", modelPlan.ID, err)
		logger.Error(err.Error(), zap.Error(err))
	}

	return err
}

func GetEmailsForModelPlanLeads(
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	modelPlanID uuid.UUID,
) ([]string, error) {
	// Get the model leads for the model plan
	planCollaborators, err := store.PlanCollaboratorGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("failed to get plan collaborators: %w", err)
	}

	logger.Info("Fetched collaborators", zap.Any("collaborators", planCollaborators))

	var modelLeadEmails []string
	for _, collaborator := range planCollaborators {
		teamRoles := models.ConvertEnums[models.TeamRole](collaborator.TeamRoles)
		logger.Info("Converted roles", zap.Any("roles", teamRoles))

		for _, role := range teamRoles {
			if role == models.TeamRoleModelLead {
				account, accountErr := collaborator.UserAccount(ctx)
				if accountErr != nil {
					logger.Error("Failed to get user account", zap.Error(accountErr))
					continue
				}
				logger.Info("Fetched user account", zap.String("email", account.Email))
				modelLeadEmails = append(modelLeadEmails, account.Email)
				break
			}
		}
	}

	logger.Info("Final model lead emails", zap.Strings("emails", modelLeadEmails))
	return modelLeadEmails, nil
}

func ConstructPhaseSuggestionEmailTemplates(
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	modelPlan *models.ModelPlan,
) (emailSubject string, emailBody string, err error) {
	// Get the email template for the model plan suggested phase
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.ModelPlanSuggestedPhaseTemplateName)
	if err != nil {
		err = fmt.Errorf("unable to get email template for model plan id %s. Err %w", modelPlan.ID, err)
		logger.Error(err.Error(), zap.Error(err))
		return "", "", err
	}

	// Construct the email subject and body
	emailSubject, err = emailTemplate.GetExecutedSubject(email.ModelPlanSuggestedPhaseSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		err = fmt.Errorf("unable to get email subject for model plan id %s. Err %w", modelPlan.ID, err)
		logger.Error(err.Error(), zap.Error(err))
		return "", "", err
	}

	emailBody, err = emailTemplate.GetExecutedBody(email.ModelPlanSuggestedPhaseBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		Phase:         string(models.ModelPhaseIcipComplete),
		SuggestedStatusesRaw: []string{
			string(models.ModelStatusIcipComplete),
		},
		SuggestedStatusesHumanized: []string{
			models.ModelStatusIcipComplete.Humanize(),
		},
		CurrentStatusHumanized: modelPlan.Status.Humanize(),
		ModelPlanID:            modelPlan.GetModelPlanID().String(),
		ModelPlanName:          modelPlan.ModelName,
	})
	if err != nil {
		err = fmt.Errorf("unable to get email body for model plan id %s. Err %w", modelPlan.ID, err)
		logger.Error(err.Error(), zap.Error(err))
		return "", "", err
	}

	return emailSubject, emailBody, nil
}

func SendEmailForPhaseSuggestionByModelPlanID(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlanID uuid.UUID,
) error {
	modelPlan, err := store.ModelPlanGetByID(store, logger, modelPlanID)
	if err != nil {
		err = fmt.Errorf("unable to get model plan for model plan id %s. Err %w", modelPlanID, err)
		logger.Error(err.Error(), zap.Error(err))
		return err
	}

	planBasics, err := store.PlanBasicsGetByModelPlanID(modelPlanID)
	if err != nil {
		return err
	}

	// Check if the model status should be updated
	phaseSuggestion, err := EvaluateSuggestedStatus(modelPlan.Status, planBasics)
	if err != nil {
		err = fmt.Errorf("unable to get anticipated phase for model plan id %s. Err %w", modelPlanID, err)
		logger.Error(err.Error(), zap.Error(err))
		return err
	}

	return SendEmailForPhaseSuggestion(
		ctx,
		logger,
		store,
		emailService,
		emailTemplateService,
		&addressBook,
		phaseSuggestion,
		modelPlan,
	)
}
