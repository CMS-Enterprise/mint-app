package worker

import (
	"context"
	"fmt"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// TranslateAuditCronJob is the job the cron schedule calls
// TranslateAuditBatchJob batches all the TranslateAuditJobs. When all are complete it will fire a callback
// args[0]
// Changes: (Job) fill out the param specs
func (w *Worker) TranslateAuditBatchJob(ctx context.Context, args ...interface{}) error {

	//Changes: (Job) get all audits that 1. aren't  In the processing table, 2. aren't  in the translated table 3. Are after a certain date?
	//Changes: (Job) The scheduled job gets and writes all entries to the DB, another piece creates the factory job and updates the status to show the thing is enqueued. It starts with a new status.

	readyToQueueEntries, err := storage.TranslatedAuditQueueGetEntriesToQueue(w.Store)
	if err != nil {
		return err
	}

	w.Logger.Debug("queue entries to create jobs for fetched")

	// Changes: (Job) Update each queue entry individually as a transaction. If the job wasn't successfully created, rollback the transaction.
	// We want to make sure that this doesn't happen multiple times.

	//Update the new processing table

	helper := faktory_worker.HelperFor(ctx)

	// Create batch of TranslateAuditJob jobs
	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Translate models"
		batch.Success = faktory.NewJob(translateAuditBatchJobSuccessName)
		batch.Success.Queue = defaultQueue

		return batch.Jobs(func() error {
			for _, queueObj := range readyToQueueEntries {
				//Changes: (Job) What if anything should move to the translated audit package?

				// Wrap everything in a transaction, so if the job doesn't push, the queue entry doesn't get updated, (so it will be picked up in another job)
				_, err := sqlutils.WithTransaction[models.TranslatedAuditQueue](w.Store, func(tx *sqlx.Tx) (*models.TranslatedAuditQueue, error) {
					queueObj.Status = models.TPSQueued
					//Changes: (Job) clean up logging, this is not needed, perhaps set it to debug?
					w.Logger.Debug("queuing job for translated audit.", zap.Any("queue entry", queueObj))

					retQueueEntry, err := storage.TranslatedAuditQueueUpdate(w.Store, w.Logger, queueObj)
					if err != nil {
						return nil, fmt.Errorf("issue saving translatedAuditQueueEntry for audit %v, queueID %s", queueObj.ChangeID, queueObj.ID)
					}

					// Changes (Job) Do we want to just put the id of the queue?
					job := faktory.NewJob(translateAuditJobName, retQueueEntry.ChangeID, retQueueEntry.ID)
					// job.Queue = criticalQueue
					job.Queue = auditTranslateQueue
					err = batch.Push(job)
					if err != nil {
						return nil, err
					}
					//Changes: (Job) clean up logging, this is not needed, perhaps set it to debug?
					w.Logger.Debug(" Finished queuing job.", zap.Any("queue entry", retQueueEntry))
					return retQueueEntry, nil
				})
				if err != nil {
					//Changes: (Job) clean up logging, this is not needed, perhaps set it to debug?
					w.Logger.Error(" error with job for translated audit.", zap.Any("queue entry", queueObj))
					return err
				}

			}
			w.Logger.Debug("done batching translation jobs")
			return nil
		})
	})
}

// TranslateAuditBatchJobSuccess is the call back that gets called when the TranslatedAuditBatchJob Completes
func (w *Worker) TranslateAuditBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	// TODO: Add notification here if wanted in the future
	return nil
}
