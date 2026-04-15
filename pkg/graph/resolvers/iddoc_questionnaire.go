package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// IDDOCQuestionnaireUpdate updates an IDDOC questionnaire
// It handles the convenience fields (needed, isComplete) and calculates
// the appropriate status based on the input and existing data.
func IDDOCQuestionnaireUpdate(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
) (*models.IDDOCQuestionnaire, error) {

	// Get existing IDDOC questionnaire
	existing, err := IDDOCQuestionnaireGetByIDLoader(ctx, id)
	if err != nil {
		return nil, err
	}

	// Track current and new status
	currentStatus := existing.Status
	newStatus := currentStatus
	iddocChangedToComplete := false

	// Note: 'needed' field is read-only via mutation - controlled solely by database triggers
	// It is not a convenience field in the input and should not be handled here

	// Handle convenience field: isComplete
	// This allows FE to mark the questionnaire as complete/incomplete
	if isCompleteValue, ok := changes["isComplete"]; ok {
		isCompletePointer, ok := isCompleteValue.(*bool)
		if !ok || isCompletePointer == nil {
			return nil, fmt.Errorf("unable to update IDDOC questionnaire, isComplete is not a bool")
		}
		isComplete := *isCompletePointer

		if isComplete {
			// Setting to complete
			newStatus = models.IDDOCQuestionnaireComplete
			iddocChangedToComplete = (currentStatus != models.IDDOCQuestionnaireComplete)

			// Set completion metadata
			if existing.CompletedDts == nil {
				// Only auto-set CompletedBy if it wasn't explicitly provided in changes
				if _, hasCompletedBy := changes["completedBy"]; !hasCompletedBy {
					existing.CompletedBy = &principal.Account().ID
				}
				existing.CompletedDts = new(time.Now().UTC())
			}
		} else {
			// Setting to incomplete
			// Check if data exists to determine IN_PROGRESS vs READY
			// Use ModifiedBy as indicator of whether questionnaire has been worked on
			// (matches pattern in baseTaskListSection.CalcStatus)
			if existing.ModifiedBy != nil {
				newStatus = models.IDDOCQuestionnaireInProgress
			} else {
				newStatus = models.IDDOCQuestionnaireReady
			}

			// Clear completion metadata
			if _, hasCompletedBy := changes["completedBy"]; !hasCompletedBy {
				existing.CompletedBy = nil
			}
			existing.CompletedDts = nil
		}

		// Remove from changes map (convenience field, not in DB)
		delete(changes, "isComplete")
	}

	// Auto-detect IN_PROGRESS if any question data changed
	// Check if any non-metadata fields are in the changes
	// Metadata fields to exclude from the check
	metadataFields := map[string]bool{
		// baseStruct fields
		"ID":          true,
		"CreatedBy":   true,
		"CreatedDts":  true,
		"ModifiedBy":  true,
		"ModifiedDts": true,
		// modelPlanRelation fields
		"ModelPlanID": true,
		// Status and completion metadata
		"Needed":       true,
		"Status":       true,
		"CompletedBy":  true,
		"CompletedDts": true,
	}

	questionFieldsChanged := false
	for field := range changes {
		if !metadataFields[field] {
			questionFieldsChanged = true
			break
		}
	}

	// If question data changed and status is READY, upgrade to IN_PROGRESS
	if questionFieldsChanged && currentStatus == models.IDDOCQuestionnaireReady {
		newStatus = models.IDDOCQuestionnaireInProgress
	}

	// Set the computed status in the model
	existing.Status = newStatus

	// Update the base struct (handles modified_by, modified_dts, etc.)
	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	// Update the IDDOC questionnaire in the database
	updatedQuestionnaire, err := storage.IDDOCQuestionnaireUpdate(store, logger, existing)
	if err != nil {
		return nil, err
	}

	// Send notifications if the questionnaire was marked complete
	if iddocChangedToComplete {
		TrySendIDDOCQuestionnaireNotifications(
			ctx,
			existing,
			logger,
			emailService,
			emailAddressBook,
			principal,
			store,
		)
	}

	return updatedQuestionnaire, nil
}

// TrySendIDDOCQuestionnaireNotifications sends notifications when IDDOC questionnaire is marked complete
func TrySendIDDOCQuestionnaireNotifications(
	ctx context.Context,
	existing *models.IDDOCQuestionnaire,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
	principal authentication.Principal,
	np sqlutils.NamedPreparer,
) {
	// Get model plan
	modelPlan, notifErr := ModelPlanGetByIDLOADER(ctx, existing.ModelPlanID)
	if notifErr != nil {
		logger.Error("failed to get model plan for IDDOC questionnaire notifications", zap.Error(notifErr))
		return
	}

	// Get user notification preferences for IDDOC questionnaire completion
	iddocQuestionnaireUANs, uacErr := storage.UserAccountGetNotificationPreferencesForIDDOCQuestionnaireCompleted(np, existing.ModelPlanID)
	if uacErr != nil {
		logger.Error("failed to get user account notification preferences", zap.Error(uacErr))
		return
	}

	emailUANs, inAppUANs := models.FilterNotificationPreferences(iddocQuestionnaireUANs)

	// Create in-app activity notifications
	_, notifErr = notifications.ActivityIDDOCQuestionnaireCompletedCreate(
		ctx,
		principal.Account().ID,
		np,
		inAppUANs,
		existing.ModelPlanID,
		existing.ID,
		principal.Account().ID,
	)
	if notifErr != nil {
		logger.Error("failed to create activity", zap.Error(notifErr))
		return
	}

	go func() {
		// Return if there is no email service
		if emailService == nil {
			return
		}

		// Send email to MINT Team Email (no footer)
		notifErr = SendIDDOCQuestionnaireCompletedEmailNotification(
			emailService,
			emailAddressBook,
			modelPlan,
			emailAddressBook.MINTTeamEmail,
			principal.Account().CommonName,
			false,
		)
		if notifErr != nil {
			logger.Error("failed to send email notifications to MINT team", zap.Error(notifErr))
			return
		}

		// Send email notifications to users who opted in (with footer)
		notifErr = SendIDDOCQuestionnaireCompletedEmailNotifications(
			emailService,
			emailAddressBook,
			emailUANs,
			modelPlan,
			principal.Account().CommonName,
			true,
		)
		if notifErr != nil {
			logger.Error("failed to send email notifications", zap.Error(notifErr))
		}
	}()
}

// IDDOCQuestionnaireGetByIDLoader calls a data loader to batch fetching an IDDOC questionnaire object by ID
func IDDOCQuestionnaireGetByIDLoader(ctx context.Context, id uuid.UUID) (*models.IDDOCQuestionnaire, error) {
	return loaders.IDDOCQuestionnaire.ByID.Load(ctx, id)
}

// IDDOCQuestionnaireGetByModelPlanIDLoader calls a data loader to batch fetching an IDDOC questionnaire object that corresponds to a model plan
func IDDOCQuestionnaireGetByModelPlanIDLoader(ctx context.Context, modelPlanID uuid.UUID) (*models.IDDOCQuestionnaire, error) {
	return loaders.IDDOCQuestionnaire.ByModelPlanID.Load(ctx, modelPlanID)
}

func getExecutedIDDOCQuestionnaireCompletedEmail(
	emailService oddmail.EmailService,
	modelPlan *models.ModelPlan,
	markedCompletedByUserCommonName string,
	showFooter bool,
) (string, string, error) {
	subjectContent := email.IDDOCQuestionnaireCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	}

	bodyContent := email.IDDOCQuestionnaireCompletedBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: markedCompletedByUserCommonName,
		ShowFooter:                      showFooter,
	}

	emailSubject, emailBody, err := email.IDDOCQuestionnaire.Completed.GetContent(subjectContent, bodyContent)
	if err != nil {
		return "", "", err
	}
	return emailSubject, emailBody, nil
}

func SendIDDOCQuestionnaireCompletedEmailNotification(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	userEmail string,
	markedCompletedByUserCommonName string,
	showFooter bool,
) error {
	emailSubject, emailBody, err := getExecutedIDDOCQuestionnaireCompletedEmail(
		emailService,
		modelPlan,
		markedCompletedByUserCommonName,
		showFooter,
	)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{userEmail},
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

func SendIDDOCQuestionnaireCompletedEmailNotifications(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	markedCompletedByUserCommonName string,
	showFooter bool,
) error {
	emailSubject, emailBody, err := getExecutedIDDOCQuestionnaireCompletedEmail(
		emailService,
		modelPlan,
		markedCompletedByUserCommonName,
		showFooter,
	)
	if err != nil {
		return err
	}

	receiverEmails := lo.Map(
		receivers,
		func(pref *models.UserAccountAndNotificationPreferences, _ int) string {
			return pref.Email
		},
	)

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{},
		nil,
		emailSubject,
		"text/html",
		emailBody,
		oddmail.WithBCC(receiverEmails),
	)
	if err != nil {
		return err
	}
	return nil
}

func SendIDDOCQuestionnaireCompletedNotification(
	ctx context.Context,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	questionnaire *models.IDDOCQuestionnaire,
	completedBy uuid.UUID,
) error {
	logger := appcontext.ZLogger(ctx)

	emailPreferences, inAppPreferences := models.FilterNotificationPreferences(receivers)

	// Create and send in-app notifications
	_, err := notifications.ActivityIDDOCQuestionnaireCompletedCreate(
		ctx,
		actorID,
		np,
		inAppPreferences,
		questionnaire.ModelPlanID,
		questionnaire.ID,
		completedBy,
	)
	if err != nil {
		logger.Error("failed to create and send in-app notifications", zap.Error(err))
		return err
	}

	completedByUser, err := userhelpers.UserAccountGetByIDLOADER(ctx, completedBy)
	if err != nil {
		logger.Error("failed to get completed by user", zap.Error(err))
		return err
	}

	// Send email to the MINTTeam email address from the address book
	err = SendIDDOCQuestionnaireCompletedEmailNotification(
		emailService,
		addressBook,
		modelPlan,
		addressBook.MINTTeamEmail,
		completedByUser.CommonName,
		false,
	)
	if err != nil {
		logger.Error("failed to send email to MINTTeam", zap.Error(err))
		return err
	}

	// Create and send email notifications
	err = SendIDDOCQuestionnaireCompletedEmailNotifications(
		emailService,
		addressBook,
		emailPreferences,
		modelPlan,
		completedByUser.CommonName,
		true,
	)
	if err != nil {
		logger.Error("failed to send email notifications", zap.Error(err))
		return err
	}

	return nil
}
