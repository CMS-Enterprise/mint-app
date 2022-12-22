package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

// DigestCronJob is the job the cron schedule calls
func (w *Worker) DigestCronJob(ctx context.Context, args ...interface{}) error {
	date := time.Now().UTC().Format("2006-01-02")

	// Call AnalyzedAuditBatchJob
	helper := faktory_worker.HelperFor(ctx)

	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob("AnalyzedAuditBatchJob", date)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
