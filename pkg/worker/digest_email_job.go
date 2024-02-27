package worker

import (
	"context"
	"fmt"
	"time"

	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/notifications"
	"github.com/cmsgov/mint-app/pkg/storage"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

/*
####################
# DigestEmail Jobs #
####################
*/

// DigestEmailBatchJob is the batch job for DigestEmailJobs
// args[0] date
func (w *Worker) DigestEmailBatchJob(ctx context.Context, args ...interface{}) error {
	dateAnalyzed := args[0].(string)

	helper := faktory_worker.HelperFor(ctx)

	userIDs, err := w.Store.PlanFavoriteCollectionGetUniqueUserIDs()
	if err != nil {
		return err
	}

	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Send Daily Digest Emails"
		batch.Success = faktory.NewJob("DigestEmailBatchJobSuccess", dateAnalyzed)
		batch.Success.Queue = defaultQueue

		return batch.Jobs(func() error {
			for _, id := range userIDs {
				job := faktory.NewJob("DigestEmailJob", dateAnalyzed, id) //TODO verify!
				job.Queue = emailQueue
				err = batch.Push(job)
				if err != nil {
					return err
				}
			}

			job := faktory.NewJob("AggregatedDigestEmailJob", dateAnalyzed)
			job.Queue = emailQueue
			return batch.Push(job)
		})
	})
}

// DigestEmailBatchJobSuccess is the callback function forDigestEmailBatchJob
// args[0] date
func (w *Worker) DigestEmailBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	// TODO: Add notification here if wanted in the future
	return nil
}

// DigestEmailJob will generate and send an email based on a users favorited Models.
// args[0] date, args[1] userID
func (w *Worker) DigestEmailJob(ctx context.Context, args ...interface{}) error {
	dateAnalyzed, err := time.Parse("2006-01-02", args[0].(string))
	if err != nil {
		return err
	}

	userIDString := args[1].(string) // This is always returned as a string from faktory
	userID, err := uuid.Parse(userIDString)
	if err != nil {
		return err
	}

	account, err := w.Store.UserAccountGetByID(w.Store, userID)
	if err != nil {
		return err
	}

	recipientEmail := account.Email

	// Get all analyzedAudits based on users favorited models
	analyzedAudits, modelPlanIDs, err := getDigestAnalyzedAudits(userID, dateAnalyzed, w.Store, w.Logger)
	if err != nil {
		return err
	}

	if len(analyzedAudits) == 0 {
		return nil
	}
	// TODO EASI-3338 wrap this in a transaction!
	systemAccountID := constants.GetSystemAccountUUID()

	// TODO EASI-3338, see about wrapping the dataloaders in the worker as well.
	preferenceFunctions := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		return storage.UserNotificationPreferencesGetByUserID(w.Store, user_id)
	}

	//TODO: EASI-3338 verify that you can use the dataloader in the worker package, it might not be that context....
	_, err = notifications.ActivityDailyDigestComplete(ctx, w.Store, systemAccountID, userID, dateAnalyzed, modelPlanIDs, preferenceFunctions)
	// _, err = notifications.ActivityDailyDigestComplete(ctx, w.Store, systemAccountID, userID, dateAnalyzed, modelPlanIDs, loaders.UserNotificationPreferencesGetByUserID)

	if err != nil {
		return fmt.Errorf("couldn't generate an activity record for hte daily digest complete activity for user %s, error: %w", userID, err)
	}
	//TODO: EASI-3338 get user preferences, or perhaps get earlier and pass it to the notifications? Only send the email if user has a preference for it.

	// Generate email subject and body from template
	emailSubject, emailBody, err := generateDigestEmail(analyzedAudits, w.EmailTemplateService, w.EmailService)
	if err != nil {
		return err
	}

	// Send generated email
	err = w.EmailService.Send(
		w.AddressBook.DefaultSender,
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

// AggregatedDigestEmailJob will generate and send an email based on all models changed in the audit period
func (w *Worker) AggregatedDigestEmailJob(ctx context.Context, args ...interface{}) error {
	dateAnalyzed, err := time.Parse("2006-01-02", args[0].(string))
	if err != nil {
		return err
	}

	err = AggregatedDigestEmailJob(
		dateAnalyzed,
		w.Store,
		w.Logger,
		w.EmailTemplateService,
		w.EmailService,
		w.AddressBook,
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

	planFavorites, err := store.PlanFavoriteGetCollectionByUserID(logger, userID)
	if err != nil {
		return nil, nil, err
	}
	if len(planFavorites) == 0 {
		return nil, nil, nil
	}

	modelPlanIds := lo.Map(planFavorites, func(p *models.PlanFavorite, index int) uuid.UUID {
		return p.ModelPlanID
	})
	if len(modelPlanIds) == 0 {
		return nil, nil, nil
	}

	analyzedAudits, err := store.AnalyzedAuditGetByModelPlanIDsAndDate(logger, modelPlanIds, date)
	if err != nil {
		return nil, nil, err
	}

	return analyzedAudits, modelPlanIds, nil
}

// generateDigestEmail will generate the daily digest email from template
func generateDigestEmail(analyzedAudits []*models.AnalyzedAudit, emailTemplateService email.TemplateServiceImpl, emailService oddmail.EmailService) (string, string, error) {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.DailyDigetsTemplateName)
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
