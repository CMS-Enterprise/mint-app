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
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,

) error {
	//TODO: EASI-(EASI-3949) Should we see if we can use a dataloader? What about for workers? Is that possible?
	account, err := store.UserAccountGetByID(store, userID)
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

	// TODO EASI-(EASI-3338), see about wrapping the dataloaders in the worker as well. This preferences function should be one level up... so we can specify it differently if called by GQL vs the worker package
	preferenceFunctions := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		return storage.UserNotificationPreferencesGetByUserID(store, user_id)
	}

	//TODO: EASI-(EASI-3338) verify that you can use the dataloader in the worker package, it might not be that context....
	_, err = notifications.ActivityDailyDigestComplete(ctx, store, systemAccountID, userID, dateAnalyzed, modelPlanIDs, preferenceFunctions)
	// _, err = notifications.ActivityDailyDigestComplete(ctx, w.Store, systemAccountID, userID, dateAnalyzed, modelPlanIDs, loaders.UserNotificationPreferencesGetByUserID)

	if err != nil {
		return fmt.Errorf("couldn't generate an activity record for the daily digest complete activity for user %s, error: %w", userID, err)
	}

	// TODO: EASI-(EASI-3949) Should we return nil if there is no email service? Or should we error
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	//TODO: EASI-(EASI-3338) get user preferences, or perhaps get earlier and pass it to the notifications? Only send the email if user has a preference for it.

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
