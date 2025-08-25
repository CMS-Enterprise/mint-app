package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

const (
	dailyDigestCronJobName string = "DailyDigestCronJob"
)

// DigestCronJob is the job the cron schedule calls
func (w *Worker) DigestCronJob(ctx context.Context, args ...interface{}) error {
	dayToAnalyze := time.Now().AddDate(0, 0, -1).UTC().Format("2006-01-02")

	// Call AnalyzedAuditBatchJob
	helper := faktory_worker.HelperFor(ctx)
	logger := loggerWithFaktoryFields(w.Logger, helper)
	logger.Info("creating Daily Analyzed Audit Cron Job")

	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(analyzedAuditBatchJobName, dayToAnalyze)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
