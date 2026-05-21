package resolvers

import (
	"context"

	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// TrySendWaiverAssessmentSurveyNotifications fires in-app and email notifications when a
// waiver assessment survey transitions to COMPLETE. Errors are logged but do not fail the
// parent transaction since notification delivery is best-effort.
func TrySendWaiverAssessmentSurveyNotifications(
	ctx context.Context,
	survey *models.WaiverAssessmentSurvey,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
	principal authentication.Principal,
	np sqlutils.NamedPreparer,
) {
	modelPlan, err := ModelPlanGetByIDLOADER(ctx, survey.ModelPlanID)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to load model plan", zap.Error(err))
		return
	}

	uans, err := storage.UserAccountGetNotificationPreferencesForWaiverAssessmentSurveyMarkedComplete(np, survey.ModelPlanID)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to get notification preferences", zap.Error(err))
		return
	}

	emailUANs, inAppUANs := models.FilterNotificationPreferences(uans)

	_, err = notifications.ActivityWaiverAssessmentSurveyMarkedCompleteCreate(
		ctx,
		principal.Account().ID,
		np,
		inAppUANs,
		survey.ModelPlanID,
		survey.ID,
		principal.Account().ID,
	)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to create activity", zap.Error(err))
		return
	}

	go func() {
		if emailService == nil {
			return
		}

		// Send to MINT team (no footer)
		if err := sendWaiverAssessmentSurveyMarkedCompleteEmail(
			emailService,
			emailAddressBook,
			modelPlan,
			emailAddressBook.MINTTeamEmail,
			principal.Account().CommonName,
			false,
		); err != nil {
			logger.Error("waiver assessment survey notification: failed to send MINT team email", zap.Error(err))
			return
		}

		// Send to opted-in users (with footer)
		if err := sendWaiverAssessmentSurveyMarkedCompleteEmails(
			emailService,
			emailAddressBook,
			emailUANs,
			modelPlan,
			principal.Account().CommonName,
			true,
		); err != nil {
			logger.Error("waiver assessment survey notification: failed to send user emails", zap.Error(err))
		}
	}()
}

func getWaiverAssessmentSurveyMarkedCompleteEmailContent(
	emailService oddmail.EmailService,
	modelPlan *models.ModelPlan,
	markedCompleteByCommonName string,
	showFooter bool,
) (string, string, error) {
	subjectContent := email.WaiverAssessmentSurveyCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.WaiverAssessmentSurveyCompletedBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: markedCompleteByCommonName,
	}
	return email.WaiverAssessmentSurvey.Completed.GetContent(subjectContent, bodyContent)
}

func sendWaiverAssessmentSurveyMarkedCompleteEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	userEmail string,
	markedCompleteByCommonName string,
	showFooter bool,
) error {
	subject, body, err := getWaiverAssessmentSurveyMarkedCompleteEmailContent(emailService, modelPlan, markedCompleteByCommonName, showFooter)
	if err != nil {
		return err
	}
	return emailService.Send(addressBook.DefaultSender, []string{userEmail}, nil, subject, "text/html", body)
}

func sendWaiverAssessmentSurveyMarkedCompleteEmails(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	markedCompleteByCommonName string,
	showFooter bool,
) error {
	subject, body, err := getWaiverAssessmentSurveyMarkedCompleteEmailContent(emailService, modelPlan, markedCompleteByCommonName, showFooter)
	if err != nil {
		return err
	}
	receiverEmails := lo.Map(receivers, func(pref *models.UserAccountAndNotificationPreferences, _ int) string {
		return pref.Email
	})
	return emailService.Send(addressBook.DefaultSender, []string{}, nil, subject, "text/html", body, oddmail.WithBCC(receiverEmails))
}
