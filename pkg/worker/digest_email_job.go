package worker

import (
	"context"
	"time"

	"github.com/cmsgov/mint-app/pkg/graph/resolvers"

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
	//TODO: EASI-3338 Be careful with this context as it might not have a data loader etc.
	sendErr := resolvers.DailyDigestEmailSend(ctx, w.Store, w.Logger, dateAnalyzed, userID, w.EmailService, &w.EmailTemplateService, w.AddressBook)
	return sendErr

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
