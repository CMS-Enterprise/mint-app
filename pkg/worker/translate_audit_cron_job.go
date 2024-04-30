package worker

import (
	"context"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

// TranslateAuditCronJob is the job the cron schedule calls
func (w *Worker) TranslateAuditCronJob(ctx context.Context, args ...interface{}) error {

	// Call TranslateAuditBatchJob
	helper := faktory_worker.HelperFor(ctx)

	// Changes: (Job) fill out the params needed here

	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(translateAuditBatchJobName)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
