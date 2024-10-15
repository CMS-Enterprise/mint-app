package resolvers

import (
	"context"

	"github.com/samber/lo"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

func getExecutedDataExchangeMarkedCompleteEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	modelPlan *models.ModelPlan,
	markedCompletedByUserCommonName string,
	showFooter bool,
) (string, string, error) {
	emailTemplate, err := templateService.GetEmailTemplate(email.DataExchangeApproachMarkedCompleteTemplateName)
	if err != nil {
		return "", "", err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.DataExchangeApproachMarkedCompleteSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		return "", "", err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.DataExchangeApproachMarkedCompleteBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: markedCompletedByUserCommonName,
		ShowFooter:                      showFooter,
	})
	if err != nil {
		return "", "", err
	}
	return emailSubject, emailBody, nil
}

func SendDataExchangeApproachMarkedCompleteEmailNotification(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	userEmail string,
	markedCompletedByUserCommonName string,
	showFooter bool,
) error {
	emailSubject, emailBody, err := getExecutedDataExchangeMarkedCompleteEmail(
		emailService,
		templateService,
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

func SendDataExchangeApproachMarkedCompleteEmailNotifications(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	markedCompletedByUserCommonName string,
	showFooter bool,
) error {
	emailSubject, emailBody, err := getExecutedDataExchangeMarkedCompleteEmail(
		emailService,
		templateService,
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

func SendDataExchangeApproachMarkedCompleteNotification(
	ctx context.Context,
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
	actorID uuid.UUID,
	np sqlutils.NamedPreparer,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	approach *models.PlanDataExchangeApproach,
	markedCompletedBy uuid.UUID,
) error {
	logger := appcontext.ZLogger(ctx)

	emailPreferences, inAppPreferences := models.FilterNotificationPreferences(receivers)

	// Create and send in-app notifications
	_, err := notifications.ActivityDataExchangeApproachMarkedCompleteCreate(
		ctx,
		actorID,
		np,
		inAppPreferences,
		approach.ModelPlanID,
		approach.ID,
		markedCompletedBy,
	)
	if err != nil {
		logger.Error("failed to create and send in-app notifications", zap.Error(err))
		return err
	}

	markedCompletedByUser, err := userhelpers.UserAccountGetByIDLOADER(ctx, markedCompletedBy)
	if err != nil {
		logger.Error("failed to get marked completed by user", zap.Error(err))
		return err
	}

	// Send email to the MINTTeam email address from the address book
	err = SendDataExchangeApproachMarkedCompleteEmailNotification(
		emailService,
		templateService,
		addressBook,
		modelPlan,
		addressBook.MINTTeamEmail,
		markedCompletedByUser.CommonName,
		false,
	)
	if err != nil {
		logger.Error("failed to send email to MINTTeam", zap.Error(err))
		return err
	}

	// Create and send email notifications
	err = SendDataExchangeApproachMarkedCompleteEmailNotifications(
		emailService,
		templateService,
		addressBook,
		emailPreferences,
		modelPlan,
		markedCompletedByUser.CommonName,
		true,
	)
	if err != nil {
		logger.Error("failed to send email notifications", zap.Error(err))
		return err
	}

	return nil
}
