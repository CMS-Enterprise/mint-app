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

func TrySendIDDOCQuestionnaireNotifications(
	ctx context.Context,
	existing *models.IDDOCQuestionnaire,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
	principal authentication.Principal,
	np sqlutils.NamedPreparer,
) {
	// Send email notifications
	modelPlan, notifErr := ModelPlanGetByIDLOADER(ctx, existing.ModelPlanID)
	if notifErr != nil {
		logger.Error("failed to send email notifications", zap.Error(notifErr))
		return
	}

	iddocQuestionnaireUANs, uacErr := storage.UserAccountGetNotificationPreferencesForIDDOCQuestionnaireCompleted(np, existing.ModelPlanID)
	if uacErr != nil {
		logger.Error("failed to get user account notification preferences", zap.Error(uacErr))
		return
	}

	emailUANs, inAppUANs := models.FilterNotificationPreferences(iddocQuestionnaireUANs)

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
		// Return nil if there is no email service
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

		// Send email notifications (footer)
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
