package worker

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"

	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// ModelStatusUpdateJob is the job to check if a model should be updated, and if so, it will send an email
// args[0] model_plan_id (UUID)
func (w *Worker) ModelStatusUpdateJob(ctx context.Context, args ...interface{}) (returnedError error) {
	helper := faktory_worker.HelperFor(ctx)
	sugaredLogger := w.Logger.With(zap.Any("JID", helper.Jid()), zap.Any("BID", helper.Bid()), zap.Any(appSectionKey, faktoryLoggingSection))
	sugaredLogger.Info("model status update job reached.")

	if len(args) < 1 {
		err := fmt.Errorf("no arguments were provided for this job")
		sugaredLogger.Error(err.Error(), zap.Error(err))
	}
	arg1String := fmt.Sprint(args[0])
	modelPlanID, err := uuid.Parse(arg1String)
	if err != nil {
		err = fmt.Errorf("unable to convert argument  ( %v )to an uuid as expected for translated_audit_queue_id for the translate audit job. Err %w", args[1], err)
		sugaredLogger.Error(err.Error(), zap.Error(err))
	}
	sugaredLogger = sugaredLogger.With(zap.Any("modelPlanID", modelPlanID))

	sugaredLogger.Info("checking if model status should be updated, and creating notification")

	modelPlan, err := w.Store.ModelPlanGetByID(w.Store, w.Logger, modelPlanID)
	if err != nil {
		err = fmt.Errorf("unable to get model plan for model plan id %s. Err %w", modelPlanID, err)
		sugaredLogger.Error(err.Error(), zap.Error(err))
		return err
	}

	// Check if the model status should be updated
	phaseSuggestion, err := resolvers.ModelPlanAnticipatedPhase(w.Store, modelPlan.Status, modelPlanID)
	if err != nil {
		err = fmt.Errorf("unable to get anticipated phase for model plan id %s. Err %w", modelPlanID, err)
		sugaredLogger.Error(err.Error(), zap.Error(err))
		return err
	}

	if nil == phaseSuggestion {
		return nil
	}

	emailTemplate, err := w.EmailTemplateService.GetEmailTemplate(email.ModelPlanSuggestedPhaseTemplateName)
	if err != nil {
		err = fmt.Errorf("unable to get email template for model plan id %s. Err %w", modelPlanID, err)
		sugaredLogger.Error(err.Error(), zap.Error(err))
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.ModelPlanSuggestedPhaseSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		err = fmt.Errorf("unable to get email subject for model plan id %s. Err %w", modelPlanID, err)
		sugaredLogger.Error(err.Error(), zap.Error(err))
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanSuggestedPhaseBodyContent{
		ClientAddress: w.EmailService.GetConfig().GetClientAddress(),
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
		err = fmt.Errorf("unable to get email body for model plan id %s. Err %w", modelPlanID, err)
		sugaredLogger.Error(err.Error(), zap.Error(err))
		return err
	}

	/*planCollaborators, err := PlanCollaboratorGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return false, fmt.Errorf("failed to get plan collaborators: %w", err)
	}

	var emailRecipients []string
	for _, collaborator := range planCollaborators {
		for _, role := range collaborator.TeamRoles {
			if role == string(models.TeamRoleModelLead) {
				collabAccount, accountErr := collaborator.UserAccount(ctx)
				if accountErr != nil {
					return false, fmt.Errorf("failed to get model lead collaborator user account for model_plan_share")
				}
				modelLeads = append(modelLeads, collabAccount.CommonName)
				break
			}
		}
	}*/

	err = w.EmailService.Send(
		w.AddressBook.DefaultSender,
		nil,
		nil,
		emailSubject,
		"text/html",
		emailBody,
		oddmail.WithBCC([]string{w.AddressBook.MINTTeamEmail}),
	)

	if err != nil {
		err = fmt.Errorf("unable to send email for model plan id %s. Err %w", modelPlanID, err)
		sugaredLogger.Error(err.Error(), zap.Error(err))
		return err
	}

	return returnedError
}
