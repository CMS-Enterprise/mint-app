package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/constants"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/logging"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// This file sends a daily digest email to a user based on models they follow. DailyDigest email sent to MINT team email is handled by AggregatedDigestEmailJob in the worker package.

// DailyDigestNotificationSend sends a single email for a user for a given day based on their favorited models
// It will also call the notification package for Daily Digest Complete Activity
func DailyDigestNotificationSend[T logging.ChainableErrorOrWarnLogger[T]](
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger T,

	dateAnalyzed time.Time,
	userID uuid.UUID,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,

) error {
	account, err := userhelpers.UserAccountGetByIDLOADER(ctx, userID)
	if err != nil {
		return err
	}

	recipientEmail := account.Email

	// Get all analyzedAudits based on users favorited models
	analyzedAudits, modelPlanIDs, err := getDigestAnalyzedAudits(np, userID, dateAnalyzed, logger)
	if err != nil {
		return err
	}

	if len(analyzedAudits) == 0 {
		return nil
	}

	systemAccountID := constants.GetSystemAccountUUID()

	//Future Enhancement use the dataloader to get user preferences and remove the getPreferencesFunc
	pref, err := loaders.UserNotificationPreferencesGetByUserID(ctx, userID)
	if err != nil {
		return fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
	}
	_, err = notifications.ActivityDailyDigestComplete(ctx, np, systemAccountID, userID, dateAnalyzed, modelPlanIDs, pref)

	if err != nil {
		return fmt.Errorf("couldn't generate an activity record for the daily digest complete activity for user %s, error: %w", userID, err)
	}

	// Return nil if there is no email service, this follows similar
	if emailService == nil {
		return nil
	}

	if !pref.DailyDigestComplete.SendEmail() {
		// Early return if user doesn't want an email
		return nil
	}

	// Generate email subject and body from template
	emailSubject, emailBody, err := generateDigestEmail(analyzedAudits, emailService)
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
	np sqlutils.NamedPreparer,
	userID uuid.UUID,
	date time.Time,
	logger logging.ILogger,
) ([]*models.AnalyzedAudit, []uuid.UUID, error) {

	planFavorites, err := storage.PlanFavoriteGetCollectionByUserID(np, logger, userID)
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

	analyzedAudits, err := storage.AnalyzedAuditGetByModelPlanIDsAndDate(np, logger, modelPlanIDs, date)
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
	emailService oddmail.EmailService,
) (string, string, error) {
	emailSubject, emailBody, err := email.DailyDigestEmails.DailyDigest.GetContent(
		email.DailyDigestSubjectContent{},
		email.DailyDigestBodyContent{
			AnalyzedAudits: analyzedAudits,
			ClientAddress:  emailService.GetConfig().GetClientAddress(),
		},
	)
	if err != nil {
		return "", "", err
	}

	return emailSubject, emailBody, nil
}
