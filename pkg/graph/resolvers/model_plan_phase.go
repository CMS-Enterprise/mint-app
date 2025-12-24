package resolvers

import (
	"context"
	"fmt"

	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/constants"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/logging"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

// ModelPlanAnticipatedPhase calculates a suggested phase for a model plan based on its current status and planTimeline
// It uses a series of status evaluation strategies to determine the suggested phase
// If no phase is suggested, it returns nil
func ModelPlanAnticipatedPhase(
	ctx context.Context,
	modelStatus models.ModelStatus,
	modelPlanID uuid.UUID,
) (*models.PhaseSuggestion, error) {

	// If the model plan is paused or canceled, we shouldn't suggest a new phase
	if modelStatus == models.ModelStatusPaused || modelStatus == models.ModelStatusCanceled {
		return nil, nil
	}

	planTimeline, err := PlanTimelineGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}

	suggestion, err := EvaluateSuggestedStatus(modelStatus, planTimeline)
	if err != nil {
		return nil, err
	}

	return suggestion, nil
}

// EvaluateSuggestedStatus evaluates the suggested status for a model plan based on its current status and planTimeline
// A nil result indicates that no phase is suggested
func EvaluateSuggestedStatus(modelStatus models.ModelStatus, planTimeline *models.PlanTimeline) (*models.PhaseSuggestion, error) {

	// Iterate over all status evaluation strategies and append valid statuses to the results slice
	statusEvaluationStrategies := GetAllStatusEvaluationStrategies()
	for _, strategy := range statusEvaluationStrategies {
		phaseSuggestion := strategy.Evaluate(modelStatus, planTimeline)
		if nil != phaseSuggestion {
			return phaseSuggestion, nil
		}
	}

	return nil, nil
}

// ShouldSendEmailForPhaseSuggestion determines if an email should be sent for a phase suggestion
func ShouldSendEmailForPhaseSuggestion(
	currentPhaseSuggestion *models.PhaseSuggestion,
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

// TrySendEmailForPhaseSuggestion sends an email to the model plan leads if the suggested phase has changed
func TrySendEmailForPhaseSuggestion[T logging.ChainableErrorOrWarnLogger[T]](
	ctx context.Context,
	logger T,
	store *storage.Store,
	emailRecipients []string,
	emailService oddmail.EmailService,
	addressBook *email.AddressBook,
	currentPhaseSuggestion *models.PhaseSuggestion,
	modelPlan *models.ModelPlan,
) error {
	if !ShouldSendEmailForPhaseSuggestion(currentPhaseSuggestion, modelPlan.PreviousSuggestedPhase) {
		return nil
	}

	emailSubject, emailBody, err := ConstructPhaseSuggestionEmailTemplates(
		logger,
		emailService,
		modelPlan,
		currentPhaseSuggestion,
	)
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

	if currentPhaseSuggestion == nil {
		return nil
	} else {
		modelPlan.PreviousSuggestedPhase = &currentPhaseSuggestion.Phase
	}

	// NOTE: It is assumed that at the point of this function call, the model plan has already been updated
	// at some point. If not, this method will fail as there is no assignment to ModifiedBy and ModifiedDts, which
	// will break on the SQL trigger.
	// TODO: As tech debt, refactor the previous suggested phase column to another field OR loosen the trigger
	// constraints to allow unrestricted modification for previous suggested phase as a more specific query
	_, err = store.ModelPlanUpdate(logger, modelPlan)
	if err != nil {
		err = fmt.Errorf("unable to update model plan for model plan id %s. Err %w", modelPlan.ID, err)
		logger.Error(err.Error(), zap.Error(err))
		return err
	}

	return nil
}

// GetEmailsForModelStatusAlert returns the email addresses of the model leads and collaborators with notifications on for a given model plan
func GetEmailsForModelStatusAlert[T logging.ChainableErrorOrWarnLogger[T]](
	ctx context.Context,
	logger T,
	store *storage.Store,
	modelPlanID uuid.UUID,
) ([]string, error) {
	// Get the collaborators for the model plan
	planCollaborators, err := store.PlanCollaboratorGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("failed to get plan collaborators: %w", err)
	}

	logger.Info("Fetched collaborators", zap.Any("collaborators", planCollaborators))

	var emailRecipients []string
	for _, collaborator := range planCollaborators {
		teamRoles := models.ConvertEnums[models.TeamRole](collaborator.TeamRoles)
		logger.Info("Converted roles", zap.Any("roles", teamRoles))

		acct, accErr := collaborator.UserAccount(ctx)
		if accErr != nil {
			logger.Warn("failed to load user account", zap.Error(accErr), zap.String("userID", collaborator.UserID.String()))
			continue
		}
		if acct.Email == "" {
			continue
		}

		if lo.Contains(teamRoles, models.TeamRoleModelLead) {
			emailRecipients = append(emailRecipients, acct.Email)
			continue
		}

		// Non-lead: include only if opted in for incorrect model status email
		pref, prefErr := UserNotificationPreferencesGetByUserID(ctx, acct.ID)
		if prefErr != nil {
			logger.Warn("unable to get user notification preferences", zap.Error(prefErr), zap.String("userID", acct.ID.String()))
			continue
		}
		if pref != nil && pref.IncorrectModelStatus.SendEmail() {
			emailRecipients = append(emailRecipients, acct.Email)
		}
	}

	logger.Info("Final email recipients", zap.Strings("emails", emailRecipients))
	return emailRecipients, nil
}

// GetCollaboratorUUIDsForModelStatusAlert returns the UUIDs of all collaborators for a given model plan
func GetCollaboratorUUIDsForModelStatusAlert(
	ctx context.Context,
	logger logging.ILogger,
	store *storage.Store,
	modelPlanID uuid.UUID,
) ([]uuid.UUID, error) {
	planCollaborators, err := store.PlanCollaboratorGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("failed to get plan collaborators: %w", err)
	}

	var uuids []uuid.UUID
	for _, collaborator := range planCollaborators {
		uuids = append(uuids, collaborator.UserID)
	}

	logger.Info("Final collaborator UUIDs", zap.Any("uuids", uuids))
	return uuids, nil
}

func sendInAppNotificationForPhaseSuggestion[T logging.ChainableErrorOrWarnLogger[T]](
	ctx context.Context,
	store *storage.Store,
	logger T,
	receiverIDs []uuid.UUID,
	modelPlanID uuid.UUID,
	phaseSuggestion *models.PhaseSuggestion,
	modelPlan *models.ModelPlan,
) error {
	preferenceFunction := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		return loaders.UserNotificationPreferencesGetByUserID(ctx, user_id)
	}

	isLeadfunc := func(user_id uuid.UUID) (bool, error) {
		collaborators, err := store.PlanCollaboratorGetByModelPlanID(logger, modelPlanID)
		if err != nil {
			return false, err
		}
		for _, collaborator := range collaborators {
			if collaborator.UserID == user_id {
				return lo.Contains(models.ConvertEnums[models.TeamRole](collaborator.TeamRoles), models.TeamRoleModelLead), nil
			}
		}
		return false, nil
	}

	systemAccountID := constants.GetSystemAccountUUID()

	_, err := notifications.ActivityIncorrectModelStatusCreate(ctx, store, systemAccountID, receiverIDs, phaseSuggestion, modelPlan, preferenceFunction, isLeadfunc)
	if err != nil {
		err = fmt.Errorf("couldn't generate an activity record for the incorrect model status activity for model plan %s, error: %w", modelPlanID, err)
		logger.Error(err.Error(), zap.Error(err))
	}

	return nil
}

func ConstructPhaseSuggestionEmailTemplates[T logging.ChainableErrorOrWarnLogger[T]](
	logger T,
	emailService oddmail.EmailService,
	modelPlan *models.ModelPlan,
	phaseSuggestion *models.PhaseSuggestion,
) (emailSubject string, emailBody string, err error) {

	if phaseSuggestion == nil {
		return "", "", fmt.Errorf("phase suggestion is nil")
	}

	// Construct the email subject and body
	subjectContent := email.ModelPlanSuggestedPhaseSubjectContent{
		ModelName: modelPlan.ModelName,
	}

	suggestedStatusStringsRaw := make([]string, len(phaseSuggestion.SuggestedStatuses))
	suggestedStatusStringsHumanized := make([]string, len(phaseSuggestion.SuggestedStatuses))
	for i, status := range phaseSuggestion.SuggestedStatuses {
		suggestedStatusStringsRaw[i] = string(status)
		suggestedStatusStringsHumanized[i] = status.Humanize()
	}

	bodyContent := email.ModelPlanSuggestedPhaseBodyContent{
		ClientAddress:              emailService.GetConfig().GetClientAddress(),
		Phase:                      string(phaseSuggestion.Phase),
		SuggestedStatusesRaw:       suggestedStatusStringsRaw,
		SuggestedStatusesHumanized: suggestedStatusStringsHumanized,
		CurrentStatusHumanized:     modelPlan.Status.Humanize(),
		ModelPlanID:                modelPlan.GetModelPlanID().String(),
		ModelPlanName:              modelPlan.ModelName,
	}

	emailSubject, emailBody, err = email.ModelPlan.SuggestedPhase.GetContent(subjectContent, bodyContent)
	if err != nil {
		err = fmt.Errorf("unable to get email for model plan id %s. Err %w", modelPlan.ID, err)
		logger.Error(err.Error(), zap.Error(err))
		return "", "", err
	}

	return emailSubject, emailBody, nil
}

func TryNotificationSendIncorrectModelStatus[T logging.ChainableErrorOrWarnLogger[T]](
	ctx context.Context,
	store *storage.Store,
	logger T,
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

	planTimeline, err := store.PlanTimelineGetByModelPlanID(modelPlanID)
	if err != nil {
		return err
	}

	// Check if the model status should be updated
	phaseSuggestion, err := EvaluateSuggestedStatus(modelPlan.Status, planTimeline)
	if err != nil {
		err = fmt.Errorf("unable to get anticipated phase for model plan id %s. Err %w", modelPlanID, err)
		logger.Error(err.Error(), zap.Error(err))
		return err
	}

	if phaseSuggestion == nil {
		logger.Info("there is no suggested phase suggestion, not sending notification", zap.Any("modelPlanID", modelPlanID))
		return nil

	}

	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailRecipients, err := GetEmailsForModelStatusAlert(ctx, logger, store, modelPlan.ID)
	if err != nil {
		return err
	}

	notificationRecipients, err := GetCollaboratorUUIDsForModelStatusAlert(ctx, logger, store, modelPlan.ID)
	if err != nil {
		return err
	}

	err = sendInAppNotificationForPhaseSuggestion(
		ctx,
		store,
		logger,
		notificationRecipients,
		modelPlan.ID,
		phaseSuggestion,
		modelPlan,
	)
	if err != nil {
		err = fmt.Errorf("unable to send in-app notification for suggested status for model plan id %s. Err %w", modelPlan.ID, err)
		logger.Error(err.Error(), zap.Error(err))
	}

	return TrySendEmailForPhaseSuggestion(
		ctx,
		logger,
		store,
		emailRecipients,
		emailService,
		&addressBook,
		phaseSuggestion,
		modelPlan,
	)
}
