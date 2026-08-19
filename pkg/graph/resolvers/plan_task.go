package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// PlanTaskGetByIDLOADER implements resolver logic to get a plan task by its ID using a data loader
func PlanTaskGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.PlanTask, error) {
	return loaders.PlanTask.ByID.Load(ctx, id)
}

// PlanTaskGetByModelPlanIDLOADER implements resolver logic to get plan tasks by model plan ID using a data loader
func PlanTaskGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.PlanTask, error) {
	return loaders.PlanTask.ByModelPlanID.Load(ctx, modelPlanID)
}

func updatePlanTaskStatusByKey(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	key models.PlanTaskKey,
	newStatus models.PlanTaskStatus,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	tasks, err := storage.PlanTaskGetByModelPlanIDLOADER(np, logger, []uuid.UUID{modelPlanID})
	if err != nil {
		return err
	}

	var task *models.PlanTask
	for _, t := range tasks {
		if t.Key == key {
			task = t
			break
		}
	}
	if task == nil {
		return fmt.Errorf("plan task not found for modelPlanID %s and key %s", modelPlanID, key)
	}

	// Ensure completion metadata matches the target status before treating an update as a no-op.
	isCompletionMetadataConsistent := (newStatus == models.PlanTaskStatusComplete && task.CompletedBy != nil && task.CompletedDts != nil) ||
		(newStatus != models.PlanTaskStatusComplete && task.CompletedBy == nil && task.CompletedDts == nil)

	// Skip writes when status + completion metadata are already correct.
	if task.Status == newStatus && isCompletionMetadataConsistent {
		return nil
	}

	didTransitionToComplete := task.Status != models.PlanTaskStatusComplete && newStatus == models.PlanTaskStatusComplete
	task.Status = newStatus

	if newStatus == models.PlanTaskStatusComplete {
		task.CompletedBy = &principal.Account().ID
		task.CompletedDts = helpers.PointerTo(time.Now().UTC())
	} else {
		task.CompletedBy = nil
		task.CompletedDts = nil
	}

	err = BaseStructPreUpdate(
		logger,
		task,
		map[string]interface{}{"status": newStatus},
		principal,
		store,
		true,
		true,
	)
	if err != nil {
		return err
	}

	_, err = storage.PlanTaskUpdate(np, logger, task)
	if err != nil {
		return err
	}

	if didTransitionToComplete {
		trySendPlanTaskCompletedNotifications(ctx, np, logger, store, modelPlanID, task, principal, emailService, addressBook)
	}

	return nil
}

func trySendPlanTaskCompletedNotifications(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	store *storage.Store,
	modelPlanID uuid.UUID,
	task *models.PlanTask,
	principal authentication.Principal,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelPlan, err := store.ModelPlanGetByID(np, logger, modelPlanID)
	if err != nil {
		logger.Error("failed to create task completed notifications", zap.Error(err))
		return
	}

	recipients, err := storage.UserAccountGetNotificationPreferencesForTaskCompleted(np, modelPlanID)
	if err != nil {
		logger.Error("failed to get task completed notification preferences", zap.Error(err))
		return
	}

	emailRecipients, inAppRecipients := models.FilterNotificationPreferences(recipients)
	if len(inAppRecipients) > 0 {
		_, err = notifications.ActivityTaskCompletedCreate(
			ctx,
			principal.Account().ID,
			np,
			inAppRecipients,
			modelPlanID,
			task,
			principal.Account().ID,
		)
		if err != nil {
			logger.Error("failed to create task completed in-app notification", zap.Error(err))
		}
	}

	if emailService == nil {
		return
	}

	modelLeadByUserID, err := getPlanTaskModelLeadByUserID(logger, store, modelPlanID)
	if err != nil {
		logger.Error("failed to get task completed model lead recipients", zap.Error(err))
		return
	}

	modelLeadEmails := []string{}
	nonModelLeadEmails := make([]string, 0, len(emailRecipients))
	for _, recipient := range emailRecipients {
		if recipient.Email == "" {
			continue
		}
		if modelLeadByUserID[recipient.ID] {
			modelLeadEmails = append(modelLeadEmails, recipient.Email)
		} else {
			nonModelLeadEmails = append(nonModelLeadEmails, recipient.Email)
		}
	}
	if len(modelLeadEmails) == 0 && len(nonModelLeadEmails) == 0 {
		return
	}

	subjectContent := email.PlanTaskCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.PlanTaskCompletedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelID:       modelPlanID.String(),
		ModelName:     modelPlan.ModelName,
		TaskName:      planTaskKeyEmailName(task.Key),
	}

	// send email to model lead
	if len(modelLeadEmails) > 0 {
		bodyContent.IsModelLead = true
		emailSubject, emailBody, err := email.PlanTask.Completed.GetContent(subjectContent, bodyContent)
		if err != nil {
			logger.Error("failed to build task completed email notification", zap.Error(err))
		} else {
			go func() {
				err := emailService.Send(
					addressBook.DefaultSender,
					[]string{},
					nil,
					emailSubject,
					"text/html",
					emailBody,
					oddmail.WithBCC(modelLeadEmails),
				)
				if err != nil {
					logger.Error("failed to send task completed email notification", zap.Error(err))
				}
			}()
		}
	}

	// send email to non-model leads
	if len(nonModelLeadEmails) > 0 {
		bodyContent.IsModelLead = false
		emailSubject, emailBody, err := email.PlanTask.Completed.GetContent(subjectContent, bodyContent)
		if err != nil {
			logger.Error("failed to build task completed email notification", zap.Error(err))
		} else {
			go func() {
				err := emailService.Send(
					addressBook.DefaultSender,
					[]string{},
					nil,
					emailSubject,
					"text/html",
					emailBody,
					oddmail.WithBCC(nonModelLeadEmails),
				)
				if err != nil {
					logger.Error("failed to send task completed email notification", zap.Error(err))
				}
			}()
		}
	}
}

func getPlanTaskModelLeadByUserID(logger *zap.Logger, store *storage.Store, modelPlanID uuid.UUID) (map[uuid.UUID]bool, error) {
	collaborators, err := store.PlanCollaboratorGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	modelLeadByUserID := make(map[uuid.UUID]bool, len(collaborators))
	for _, collaborator := range collaborators {
		for _, teamRole := range collaborator.TeamRoles {
			if models.TeamRole(teamRole) == models.TeamRoleModelLead {
				modelLeadByUserID[collaborator.UserID] = true
				break
			}
		}
	}

	return modelLeadByUserID, nil
}

func planTaskKeyEmailName(key models.PlanTaskKey) string {
	switch key {
	case models.PlanTaskKeyModelPlan:
		return "Model Plan"
	case models.PlanTaskKeyDataExchange:
		return "Data exchange approach"
	case models.PlanTaskKeyMto:
		return "Model-to-operations matrix (MTO)"
	default:
		return string(key)
	}
}
