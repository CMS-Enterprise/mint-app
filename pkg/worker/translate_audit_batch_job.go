package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/storage"
)

// TranslateAuditCronJob is the job the cron schedule calls
// TranslateAuditBatchJob batches all the TranslateAuditJobs. When all are complete it will fire a callback
// args[0]
// Changes: (Job) fill out the param specs
func (w *Worker) TranslateAuditBatchJob(ctx context.Context, args ...interface{}) error {
	dayToAnalyze := args[0]

	//Changes: (Job) get all audits that 1. aren't  In the processing table, 2. aren't  in the translated table 3. Are after a certan date?
	audits, err := storage.AuditChangeCollectionGetByModelPlanIDandTimeRange(w.Store, w.Logger, uuid.Nil, time.Now(), time.Now())
	if err != nil {
		return err
	}
	w.Logger.Info("audits fetched for translating", zap.Any("audits", audits))

	//Update the new processing table

	helper := faktory_worker.HelperFor(ctx)

	// Create batch of TranslateAuditJob jobs
	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Translate models"
		batch.Success = faktory.NewJob(translateAuditBatchJobSuccessName, dayToAnalyze)
		batch.Success.Queue = criticalQueue

		return batch.Jobs(func() error {
			for _, audit := range audits {
				job := faktory.NewJob(translateAuditJobName, audit.ID)
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
