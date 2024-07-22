package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

// TranslateAuditCronJob is the job the cron schedule calls
func (w *Worker) TranslateAuditCronJob(ctx context.Context, args ...interface{}) error {

	// Call TranslateAuditBatchJob
	helper := faktory_worker.HelperFor(ctx)

	now := time.Now()

	// Note, this function doesn't need a param, adding so it can be distinguished from another batch job call
	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(translateAuditBatchJobName, now)
		job.Queue = criticalQueue //TODO: (Job) Should we perhaps create a separate  queue for this? Is it making an issue?
		return cl.Push(job)
	})
}
