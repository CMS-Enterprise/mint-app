package worker

import (
	"go.uber.org/zap"

	faktory_worker "github.com/contribsys/faktory_worker_go"

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
	AddressBook          email.AddressBook
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

	mgr := faktory_worker.NewManager()

	// Setup Monager
	mgr.Concurrency = w.Connections

	// pull jobs from these queues, in this order of precedence
	mgr.ProcessStrictPriorityQueues(criticalQueue, defaultQueue, emailQueue)

	// register jobs here
	mgr.Register("DailyDigestCronJob", w.DigestCronJob)

	mgr.Register("AnalyzedAuditJob", w.AnalyzedAuditJob)
	mgr.Register("AnalyzedAuditBatchJob", w.AnalyzedAuditBatchJob)
	mgr.Register("AnalyzedAuditBatchJobSuccess", w.AnalyzedAuditBatchJobSuccess)

	mgr.Register("DigestEmailBatchJob", w.DigestEmailBatchJob)
	mgr.Register("DigestEmailBatchJobSuccess", w.DigestEmailBatchJobSuccess)
	mgr.Register("DigestEmailJob", w.DigestEmailJob)
	mgr.Register("AggregatedDigestEmailJob", w.AggregatedDigestEmailJob)

	err := mgr.Run()
	if err != nil {
		panic(err)
	}
}
