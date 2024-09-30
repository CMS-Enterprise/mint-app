package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

func SendDataExchangeApproachCompletedEmailNotification(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	userEmail string,
	markedCompletedByUserCommonName string,
	showFooter bool,
) error {
	emailTemplate, err := templateService.GetEmailTemplate(email.DataExchangeApproachCompletedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.DataExchangeApproachCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.DataExchangeApproachCompletedBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: markedCompletedByUserCommonName,
		ShowFooter:                      showFooter,
	})
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

func SendDataExchangeApproachCompletedEmailNotifications(
	ctx context.Context,
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	markedCompletedByUserCommonName string,
	showFooter bool,
) error {
	for _, user := range receivers {
		err := SendDataExchangeApproachCompletedEmailNotification(
			emailService,
			templateService,
			addressBook,
			modelPlan,
			user.Email,
			markedCompletedByUserCommonName,
			showFooter,
		)
		if err != nil {
			return err
		}
	}
	return nil
}

func SendDataExchangeApproachCompletedNotification(
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
	_, err := notifications.ActivityDataExchangeApproachCompletedCreate(
		ctx,
		actorID,
		np,
		inAppPreferences,
		approach.ID,
		markedCompletedBy,
		loaders.UserNotificationPreferencesGetByUserID,
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
	err = SendDataExchangeApproachCompletedEmailNotification(
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
	err = SendDataExchangeApproachCompletedEmailNotifications(
		ctx,
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
