package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"
)

const (
	dailyDigestCronJobName string = "DailyDigestCronJob"
)

// DigestCronJob is the job the cron schedule calls
func (w *Worker) DigestCronJob(ctx context.Context, args ...interface{}) error {
	helper := faktory_worker.HelperFor(ctx)
	base := loggerWithFaktoryFields(w.Logger, helper)
	logger := RetryAwareLogger(ctx, base) // demotes Error->Warn unless final attempt

	dayToAnalyze := time.Now().AddDate(0, 0, -1).UTC().Format("2006-01-02")
	logger.Info("creating Daily Analyzed Audit Cron Job", zap.String("day", dayToAnalyze))

	return helper.With(func(cl *faktory.Client) error {
		job := faktory.NewJob(analyzedAuditBatchJobName, dayToAnalyze)
		job.Queue = criticalQueue
		return cl.Push(job)
	})
}
