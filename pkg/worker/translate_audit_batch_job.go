package worker

import (
	"context"
	"fmt"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// TranslateAuditCronJob is the job the cron schedule calls
// TranslateAuditBatchJob batches all the TranslateAuditJobs. When all are complete it will fire a callback
// args[0]
// Changes: (Job) fill out the param specs
func (w *Worker) TranslateAuditBatchJob(ctx context.Context, args ...interface{}) error {

	//Changes: (Job) get all audits that 1. aren't  In the processing table, 2. aren't  in the translated table 3. Are after a certain date?
	//Changes: (Job) The scheduled job gets and writes all entries to the DB, another piece creates the factory job and updates the status to show the thing is enqueued. It starts with a new status.
	unProcessed, err := storage.AuditChangeGetNotProcessed(w.Store, *w.Logger)
	if err != nil {
		return err
	}
	w.Logger.Info("audits fetched for translating", zap.Any("audits", unProcessed))

	//Update the new processing table

	helper := faktory_worker.HelperFor(ctx)

	// Create batch of TranslateAuditJob jobs
	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Translate models"
		batch.Success = faktory.NewJob(translateAuditBatchJobSuccessName)
		batch.Success.Queue = criticalQueue

		return batch.Jobs(func() error {
			for _, audit := range unProcessed {
				//Changes: (Job) What if anything should move to the translated audit package?

				queueEntry := models.NewTranslatedAuditQueueEntry(constants.GetSystemAccountUUID(), audit.ID)

				retQueueEntry, err := storage.TranslatedAuditQueueCreate(w.Store, queueEntry)
				if err != nil {
					return fmt.Errorf("issue saving translatedAuditQueueEntry for audit %v", audit.ID)
				}

				job := faktory.NewJob(translateAuditJobName, audit.ID, retQueueEntry.ID)
				job.Queue = criticalQueue
				err = batch.Push(job)
				if err != nil {
					return err
				}
			}
			return nil
		})
	})
}

// TranslateAuditBatchJobSuccess is the call back that gets called when the TranslatedAuditBatchJob Completes
func (w *Worker) TranslateAuditBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	// TODO: Add notification here if wanted in the future
	return nil
}
