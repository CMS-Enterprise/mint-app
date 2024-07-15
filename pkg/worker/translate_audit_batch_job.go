package worker

import (
	"context"
	"fmt"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/translatedaudit"
)

var translatedAuditJobMaxRetry = 2

// TranslateAuditCronJob is the job the cron schedule calls
// TranslateAuditBatchJob batches all the TranslateAuditJobs. When all are complete it will fire a callback
// args are not currently being used.
func (w *Worker) TranslateAuditBatchJob(ctx context.Context, args ...interface{}) error {
	readyToQueueEntries, err := storage.TranslatedAuditQueueGetEntriesToQueue(w.Store)
	if err != nil {
		return err
	}

	w.Logger.Debug("queue entries to create jobs for fetched")

	helper := faktory_worker.HelperFor(ctx)

	// Create batch of TranslateAuditJob jobs
	return helper.With(func(cl *faktory.Client) error {
		return CreateTranslatedAuditBatch(w, cl, readyToQueueEntries)
	})
}

// QueueTranslatedAuditJob takes a given queueObj and creates a job as part of the provided batch
func QueueTranslatedAuditJob(w *Worker, batch *faktory.Batch, queueObj *models.TranslatedAuditQueue) (*models.TranslatedAuditQueue, error) {
	// Wrap everything in a transaction, so if the job doesn't push, the queue entry doesn't get updated, (so it will be picked up in another job)
	return sqlutils.WithTransaction[models.TranslatedAuditQueue](w.Store, func(tx *sqlx.Tx) (*models.TranslatedAuditQueue, error) {
		queueObj.Status = models.TPSQueued
		w.Logger.Debug("queuing job for translated audit.", zap.Any("queue entry", queueObj))

		retQueueEntry, err := translatedaudit.TranslatedAuditQueueUpdate(w.Store, w.Logger, queueObj, constants.GetSystemAccountUUID())
		if err != nil {
			return nil, fmt.Errorf("issue saving translatedAuditQueueEntry for audit %v, queueID %s", queueObj.ChangeID, queueObj.ID)
		}

		// Change ID not strictly needed here, the job can get it from queue id, but this is for convenience.
		job := faktory.NewJob(translateAuditJobName, retQueueEntry.ChangeID, retQueueEntry.ID)
		job.Queue = auditTranslateQueue

		job.Retry = &translatedAuditJobMaxRetry
		err = batch.Push(job)
		if err != nil {
			return nil, err
		}

		w.Logger.Debug(" Finished queuing job.", zap.Any("queue entry", retQueueEntry))
		return retQueueEntry, nil
	})
}

// CreateTranslatedAuditBatch Creates a new batch job using the provided faktory client
// it will create a translated audit job for each provided queueObject
func CreateTranslatedAuditBatch(w *Worker, cl *faktory.Client, queueObjects []*models.TranslatedAuditQueue) error {

	batch := faktory.NewBatch(cl)
	batch.Description = "Translate models"
	batch.Success = faktory.NewJob(translateAuditBatchJobSuccessName)
	batch.Success.Queue = criticalQueue

	err := batch.Jobs(func() error {
		for _, queueObj := range queueObjects {
			_, err := QueueTranslatedAuditJob(w, batch, queueObj)
			if err != nil {
				err = fmt.Errorf(" error with job for translated audit. queueID %v, changeID %v. Err %w", queueObj.ID, queueObj.ChangeID, err)
				w.Logger.Error(err.Error())
				return err
			}
		}
		w.Logger.Debug("done batching translation jobs")
		return nil
	})
	if err != nil {
		return err
	}

	return err
}

// TranslateAuditBatchJobSuccess is the call back that gets called when the TranslatedAuditBatchJob Completes
func (w *Worker) TranslateAuditBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	//  Add notification here if wanted in the future
	return nil
}
