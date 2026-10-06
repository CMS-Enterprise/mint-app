package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

const (
	prepareForClearanceCronJobName string = "PrepareForClearanceCronJob"
)

// PrepareForClearanceCronJob is the job the cron schedule calls once a day to check whether any
// model plans' PREPARE_FOR_CLEARANCE task should activate (see
// models.PrepareForClearanceTriggerDays).
func (w *Worker) PrepareForClearanceCronJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)

	now := time.Now()

	logger := FaktoryLoggerFromContext(ctx)
	logger.Info("creating Prepare For Clearance Cron Job")

	// Note, this function doesn't need a param, adding so it can be distinguished from another batch job call
	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(prepareForClearanceBatchJobName, now)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
