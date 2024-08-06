package worker

import (
	"context"
	"fmt"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/logfields"
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
	helper := faktory_worker.HelperFor(ctx)
	// decorate the logger, but exclude the bid, the bid will be decorated when we create the batch
	logger := loggerWithFaktoryFieldsWithoutBatchID(w.Logger, helper)
	logger.Debug("queue entries to create jobs for fetched")

	readyToQueueEntries, err := storage.TranslatedAuditQueueGetEntriesToQueue(w.Store)
	if err != nil {
		logger.Error("issue getting entries to queue for audit translation ", zap.Error(err))
		return err
	}

	// Create batch of TranslateAuditJob jobs
	return helper.With(func(cl *faktory.Client) error {
		logger.Info("preparing to create Translated Audit Batch")
		return CreateTranslatedAuditBatch(w, logger, cl, readyToQueueEntries)
	})
}

// QueueTranslatedAuditJob takes a given queueObj and creates a job as part of the provided batch
func QueueTranslatedAuditJob(w *Worker, logger *zap.Logger, batch *faktory.Batch, queueObj *models.TranslatedAuditQueue) (*models.TranslatedAuditQueue, error) {
	// Wrap everything in a transaction, so if the job doesn't push, the queue entry doesn't get updated, (so it will be picked up in another job)
	logger = logger.With(logfields.TranslatedAuditQueueID(queueObj.ID), logfields.AuditChangeID(queueObj.ChangeID), logfields.AuditQueueAttempts(queueObj.Attempts))
	return sqlutils.WithTransaction[models.TranslatedAuditQueue](w.Store, func(tx *sqlx.Tx) (*models.TranslatedAuditQueue, error) {
		queueObj.Status = models.TPSQueued
		logger.Info("queuing job for translated audit.", zap.Any("queue entry", queueObj))

		retQueueEntry, err := translatedaudit.TranslatedAuditQueueUpdate(w.Store, w.Logger, queueObj, constants.GetSystemAccountUUID())
		if err != nil {
			err := fmt.Errorf("issue saving translatedAuditQueueEntry for audit %v, queueID %s", queueObj.ChangeID, queueObj.ID)
			logger.Error(err.Error(), zap.Error(err))
			return nil, err
		}

		// Change ID not strictly needed here, the job can get it from queue id, but this is for convenience.
		job := faktory.NewJob(translateAuditJobName, retQueueEntry.ChangeID, retQueueEntry.ID)
		job.Queue = auditTranslateQueue

		job.Retry = &translatedAuditJobMaxRetry
		err = batch.Push(job)
		if err != nil {
			err := fmt.Errorf("issue pushing translated audit job to batch")
			logger.Error(err.Error(), zap.Error(err))
			return nil, err
		}

		logger.Info("finished queuing job.", zap.Any("queue entry", retQueueEntry))
		return retQueueEntry, nil
	})
}

// CreateTranslatedAuditBatch Creates a new batch job using the provided faktory client
// it will create a translated audit job for each provided queueObject
func CreateTranslatedAuditBatch(w *Worker, logger *zap.Logger, cl *faktory.Client, queueObjects []*models.TranslatedAuditQueue) error {

	batch := faktory.NewBatch(cl)
	logger = logger.With(logfields.BID(batch.Bid))
	batch.Description = "Translate models"
	batch.Success = faktory.NewJob(translateAuditBatchJobSuccessName)
	batch.Success.Queue = criticalQueue
	logger.Info("Translate audit batch created")

	err := batch.Jobs(func() error {
		for _, queueObj := range queueObjects {
			_, err := QueueTranslatedAuditJob(w, logger, batch, queueObj)
			if err != nil {
				err = fmt.Errorf(" error with job for translated audit. queueID %v, changeID %v. Err %w", queueObj.ID, queueObj.ChangeID, err)
				return err
			}
		}
		logger.Info("done batching translation jobs")
		return nil
	})
	if err != nil {
		logger.Error("error creating translated audit jobs", zap.Error(err))
		return err
	}

	return err
}

// TranslateAuditBatchJobSuccess is the call back that gets called when the TranslatedAuditBatchJob Completes
func (w *Worker) TranslateAuditBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFields(w.Logger, helper)
	logger.Info("Digest Email Batch Job Succeeded")
	//  Add notification here if wanted in the future
	return nil
}
