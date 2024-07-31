package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"
)

// ModelStatusUpdateCronJob is the job the cron schedule calls to check if models
func (w *Worker) ModelStatusUpdateCronJob(ctx context.Context, args ...interface{}) error {

	// Call ModelStatusUpdateBatchJob
	helper := faktory_worker.HelperFor(ctx)

	now := time.Now()

	w.Logger.Info("creating Model Status Update Cron Job", zap.Any("JID", helper.Jid()), zap.Any(appSectionKey, faktoryLoggingSection))

	// Note, this function doesn't need a param, adding so it can be distinguished from another batch job call
	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(modelStatusUpdateBatchJobName, now)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
