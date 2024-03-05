package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/notifications"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// DailyDigestNotificationSend sends a single email for a user for a given day based on their favorited models
// It will also call the notification package for Daily Digest Complete Activity
func DailyDigestNotificationSend(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	// np sqlutils.NamedPreparer,
	dateAnalyzed time.Time,
	userID uuid.UUID,
	getPreferencesFunc notifications.GetUserNotificationPreferencesFunc,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,

) error {

	/***********************
	* //Future Enhancement *
	************************
	* If we are able to provide dataloaders to faktory workers, replace store calls with dataloaders for
	*   a. Get User account
	*   b. Get User Preferences
	 */
	account, err := storage.UserAccountGetByID(store, userID)
	if err != nil {
		return err
	}

	recipientEmail := account.Email

	// Get all analyzedAudits based on users favorited models
	analyzedAudits, modelPlanIDs, err := getDigestAnalyzedAudits(userID, dateAnalyzed, store, logger)
	if err != nil {
		return err
	}

	if len(analyzedAudits) == 0 {
		return nil
	}
	// TODO EASI-(EASI-3338) wrap this in a transaction!
	systemAccountID := constants.GetSystemAccountUUID()

	//Future Enhancement use the dataloader to get user preferences and remove the getPreferencesFunc
	_, err = notifications.ActivityDailyDigestComplete(ctx, store, systemAccountID, userID, dateAnalyzed, modelPlanIDs, getPreferencesFunc)

	if err != nil {
		return fmt.Errorf("couldn't generate an activity record for the daily digest complete activity for user %s, error: %w", userID, err)
	}

	// Return nil if there is no email service, this follows similar
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	preference, err := getPreferencesFunc(ctx, userID)
	if err != nil {
		return fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
	}

	if !preference.DailyDigestComplete.SendEmail() {
		// Early return if user doesn't want an email
		return nil
	}

	// Generate email subject and body from template
	emailSubject, emailBody, err := generateDigestEmail(analyzedAudits, emailTemplateService, emailService)
	if err != nil {
		return err
	}

	// Send generated email
	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{recipientEmail},
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

/*
############################
# DigestEmail Jobs Helpers #
############################
*/

// getDigestAnalyzedAudits gets AnalyzedAudits based on a users favorited plans and date
// it returns the list of analyzed audits, as well as a separate list of the model plan IDs of the analyzed audits
func getDigestAnalyzedAudits(
	userID uuid.UUID,
	date time.Time,
	store *storage.Store,
	logger *zap.Logger,
) ([]*models.AnalyzedAudit, []uuid.UUID, error) {
	//TODO: EASI-(EASI-3338) Consider making this take a date and an array of model_plan_ids, so it can be reused elsewhere

	planFavorites, err := store.PlanFavoriteGetCollectionByUserID(logger, userID)
	if err != nil {
		return nil, nil, err
	}
	if len(planFavorites) == 0 {
		return nil, nil, nil
	}

	modelPlanIDs := lo.Map(planFavorites, func(p *models.PlanFavorite, index int) uuid.UUID {
		return p.ModelPlanID
	})
	if len(modelPlanIDs) == 0 {
		return nil, nil, nil
	}

	analyzedAudits, err := store.AnalyzedAuditGetByModelPlanIDsAndDate(logger, modelPlanIDs, date)
	if err != nil {
		return nil, nil, err
	}
	analyzedAuditsModelPlanIDs := lo.Map(analyzedAudits, func(audit *models.AnalyzedAudit, _ int) uuid.UUID {
		return audit.ModelPlanID
	})

	return analyzedAudits, analyzedAuditsModelPlanIDs, nil
}

// generateDigestEmail will generate the daily digest email from template
func generateDigestEmail(
	analyzedAudits []*models.AnalyzedAudit,
	emailTemplateService email.TemplateService,
	emailService oddmail.EmailService) (string, string, error) {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.DailyDigestTemplateName)
	if err != nil {
		return "", "", err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.DailyDigestSubjectContent{})
	if err != nil {
		return "", "", err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.DailyDigestBodyContent{
		AnalyzedAudits: analyzedAudits,
		ClientAddress:  emailService.GetConfig().GetClientAddress(),
	})
	if err != nil {
		return "", "", err
	}

	return emailSubject, emailBody, nil
}
