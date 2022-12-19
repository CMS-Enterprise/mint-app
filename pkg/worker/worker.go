package worker

import (
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// Worker is a struct that contains all the dependencies to run worker functions
type Worker struct {
	Store                *storage.Store
	Logger               *zap.Logger
	EmailService         oddmail.EmailService
	EmailTemplateService email.TemplateServiceImpl
	Manager              *faktory_worker.Manager
	Connections          int
	ProcessJobs          bool
}

const (
	// defaultQueue the default queue in Faktory
	defaultQueue string = "default"

	// criticalQueue the critical queue in Faktory
	criticalQueue string = "critical"

	// emailQueue the email queue in Faktory
	emailQueue string = "email"
)

// Work creates, configues, and starts worker
func (w *Worker) Work() {

	if !w.ProcessJobs {
		return
	}

	// Setup Monager
	w.Manager.Concurrency = w.Connections

	// pull jobs from these queues, in this order of precedence
	w.Manager.ProcessStrictPriorityQueues(criticalQueue, defaultQueue, emailQueue)

	// register jobs here
	w.Manager.Register("DailyDigestCronJob", w.DailyDigestCronJob)

	w.Manager.Register("AnalyzedAuditJob", w.AnalyzedAuditJob)
	w.Manager.Register("AnalyzedAuditBatchJob", w.AnalyzedAuditBatchJob)
	w.Manager.Register("AnalyzedAuditBatchJobSuccess", w.AnalyzedAuditBatchJobSuccess)

	w.Manager.Register("DailyDigestEmailBatchJob", w.DailyDigestEmailBatchJob)
	w.Manager.Register("DailyDigestEmailBatchJobSuccess", w.DailyDigestEmailBatchJobSuccess)
	w.Manager.Register("DailyDigestEmailJob", w.DailyDigestEmailJob)

	err := w.Manager.Run()
	if err != nil {
		panic(err)
	}
}
