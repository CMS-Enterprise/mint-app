package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

// ModelStatusUpdateCronJob is the job the cron schedule calls to check if models
func (w *Worker) ModelStatusUpdateCronJob(ctx context.Context, args ...interface{}) error {

	// Call ModelStatusUpdateBatchJob
	helper := faktory_worker.HelperFor(ctx)

	now := time.Now()

	logger := loggerWithFaktoryFieldsWithoutBatchID(w.Logger, helper)
	logger.Info("creating Model Status Update Cron Job")

	// Note, this function doesn't need a param, adding so it can be distinguished from another batch job call
	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(modelStatusUpdateBatchJobName, now)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
