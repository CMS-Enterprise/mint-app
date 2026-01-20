package worker

import (
	"context"
	"fmt"
	"time"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/logfields"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
)

/*
####################
# DigestEmail Jobs #
####################
*/

const (
	digestEmailBatchJobName        string = "DigestEmailBatchJob"
	digestEmailBatchJobSuccessName string = "DigestEmailBatchJobSuccess"
	digestEmailJobName             string = "DigestEmailJob"
	aggregatedDigestEmailJobName   string = "AggregatedDigestEmailJob"
)

// DigestEmailBatchJob is the batch job for DigestEmailJobs
// args[0] date
func (w *Worker) DigestEmailBatchJob(ctx context.Context, args ...interface{}) error {
	logger := FaktoryLoggerFromContext(ctx)

	if len(args) < 1 {
		logger.Error("insufficient arguments for DigestEmailBatchJob", zap.Int("argCount", len(args)))
		return fmt.Errorf("expected 1 argument, got %d", len(args))
	}

	dateAnalyzed, ok := args[0].(string)
	if !ok {
		logger.Error("args[0] is not a string", zap.String("type", fmt.Sprintf("%T", args[0])))
		return fmt.Errorf("args[0] must be a string, got %T", args[0])
	}

	helper := faktory_worker.HelperFor(ctx)

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
		logger = logger.With(logfields.BID(batch.Bid))
		logger.Info("Creating a new batch for the daily digest email batch job")
		return batch.Jobs(func() error {
			for _, id := range userIDs {
				innerLogger := logger.With(logfields.Date(dateAnalyzed), logfields.UserID(id))
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
	logger := FaktoryLoggerFromContext(ctx)
	logger.Info("Digest Email Batch Job Succeeded")
	// TODO: Add notification here if wanted in the future
	return nil
}

// DigestEmailJob will generate and send an email based on a users favorited Models.
// args[0] date, args[1] userID
func (w *Worker) DigestEmailJob(ctx context.Context, args ...interface{}) error {
	logger := FaktoryLoggerFromContext(ctx)

	if len(args) < 2 {
		logger.Error("insufficient arguments for DigestEmailJob", zap.Int("argCount", len(args)))
		return fmt.Errorf("expected 2 arguments, got %d", len(args))
	}

	dateStr, ok := args[0].(string)
	if !ok {
		logger.Error("args[0] is not a string", zap.String("type", fmt.Sprintf("%T", args[0])))
		return fmt.Errorf("args[0] must be a string, got %T", args[0])
	}

	dateAnalyzed, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		logger.Error("failed to parse date", zap.String("dateStr", dateStr), zap.Error(err))
		return err
	}

	userIDString, ok := args[1].(string)
	if !ok {
		logger.Error("args[1] is not a string", zap.String("type", fmt.Sprintf("%T", args[1])))
		return fmt.Errorf("args[1] must be a string, got %T", args[1])
	}

	userID, err := uuid.Parse(userIDString)
	if err != nil {
		logger.Error("failed to parse user ID", zap.String("userIDString", userIDString), zap.Error(err))
		return err
	}
	logger = logger.With(logfields.Date(dateAnalyzed), logfields.UserID(userID))
	logger.Info("preparing to send daily digest email")

	// Note, if desired we can wrap this in a transaction so if there is a failure sending an email, the notification in the database also gets rolled back.
	// This is not needed currently.
	sendErr := resolvers.DailyDigestNotificationSend(ctx, w.Store, logger, dateAnalyzed, userID, w.EmailService, w.AddressBook)
	if sendErr != nil {
		logger.Error("error sending daily digest notification", zap.Error(sendErr))
	}
	return sendErr

}

// AggregatedDigestEmailJob will generate and send an email based on all models changed in the audit period
func (w *Worker) AggregatedDigestEmailJob(ctx context.Context, args ...interface{}) error {
	logger := FaktoryLoggerFromContext(ctx)

	if len(args) < 1 {
		logger.Error("insufficient arguments for AggregatedDigestEmailJob", zap.Int("argCount", len(args)))
		return fmt.Errorf("expected 1 argument, got %d", len(args))
	}

	dateStr, ok := args[0].(string)
	if !ok {
		logger.Error("args[0] is not a string", zap.String("type", fmt.Sprintf("%T", args[0])))
		return fmt.Errorf("args[0] must be a string, got %T", args[0])
	}

	dateAnalyzed, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		logger.Error("failed to parse date", zap.String("dateStr", dateStr), zap.Error(err))
		return err
	}
	logger = logger.With(logfields.Date(dateAnalyzed))
	logger.Info("preparing to send aggregated digest email")
	err = AggregatedDigestEmailJob(
		dateAnalyzed,
		w.Store,
		logger,
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
