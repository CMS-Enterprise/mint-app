package worker

import (
	"context"
	"time"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
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
	logger := loggerWithFaktoryFields(w.Logger, helper)

	logger.Info("getting collection of unique userIds that have favorited a model")

	userIDs, err := w.Store.PlanFavoriteCollectionGetUniqueUserIDs()
	if err != nil {
		return err
	}

	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Send Daily Digest Emails"
		batch.Success = faktory.NewJob(digestEmailBatchJobSuccessName, dateAnalyzed)
		batch.Success.Queue = defaultQueue
		logger = logger.With(BIDZapField(batch.Bid))
		logger.Info("Creating a new batch for the daily digest email batch job")
		return batch.Jobs(func() error {
			for _, id := range userIDs {
				innerLogger := logger.With(dateZapField(dateAnalyzed), userIDZapField(id))
				innerLogger.Info("creating digest email job")
				job := faktory.NewJob(digestEmailJobName, dateAnalyzed, id)
				job.Queue = emailQueue
				innerLogger.Info("pushing digest email job")
				err = batch.Push(job)
				if err != nil {
					innerLogger.Error(" issue pushing digest email job", zap.Error(err))
					return err
				}
			}

			job := faktory.NewJob(aggregatedDigestEmailJobName, dateAnalyzed)
			job.Queue = emailQueue
			return batch.Push(job)
		})
	})
}

// DigestEmailBatchJobSuccess is the callback function forDigestEmailBatchJob
// args[0] date
func (w *Worker) DigestEmailBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFieldsAndBatchID(w.Logger, helper)
	logger.Info("Digest Email Batch Job Succeeded")
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
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFieldsAndBatchID(w.Logger, helper, dateZapField(dateAnalyzed), userIDZapField(userID))
	logger.Info("preparing to send daily digest email")
	preferenceFunctions := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		return storage.UserNotificationPreferencesGetByUserID(w.Store, user_id)
	}
	// Note, if desired we can wrap this in a transaction so if there is a failure sending an email, the notification in the database also gets rolled back.
	// This is not needed currently.
	sendErr := resolvers.DailyDigestNotificationSend(ctx, w.Store, logger, dateAnalyzed, userID, preferenceFunctions, w.EmailService, &w.EmailTemplateService, w.AddressBook)
	if sendErr != nil {
		logger.Error("error sending daily digest notification", zap.Error(sendErr))
	}
	return sendErr

}

// AggregatedDigestEmailJob will generate and send an email based on all models changed in the audit period
func (w *Worker) AggregatedDigestEmailJob(ctx context.Context, args ...interface{}) error {
	dateAnalyzed, err := time.Parse("2006-01-02", args[0].(string))
	if err != nil {
		return err
	}
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFieldsAndBatchID(w.Logger, helper, dateZapField(dateAnalyzed))
	logger.Info("preparing to send aggregated digest email")
	err = AggregatedDigestEmailJob(
		dateAnalyzed,
		w.Store,
		logger,
		w.EmailTemplateService,
		w.EmailService,
		w.AddressBook,
	)
	if err != nil {
		logger.Error("error sending the aggregated digest email", zap.Error(err))
		return err
	}

	logger.Info("aggregated digest email sent successfully")
	return nil
}
