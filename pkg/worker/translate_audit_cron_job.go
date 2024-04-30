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

	// Changes: (Job) fill out the params needed here, there is an error if there aren't any args, but we don't really need them

	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(translateAuditBatchJobName, now)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
