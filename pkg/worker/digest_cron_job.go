package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"
)

// DigestCronJob is the job the cron schedule calls
func (w *Worker) DigestCronJob(ctx context.Context, args ...interface{}) error {
	dayToAnalyze := time.Now().AddDate(0, 0, -1).UTC().Format("2006-01-02")

	// Call AnalyzedAuditBatchJob
	helper := faktory_worker.HelperFor(ctx)
	w.Logger.Info("creating Daily Analyzed Audit Cron Job", zap.Any("JID", helper.Jid()))

	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(analyzedAuditBatchJobName, dayToAnalyze)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
