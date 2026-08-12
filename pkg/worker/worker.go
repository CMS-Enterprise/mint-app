package worker

import (
	"context"
	"fmt"
	"net"
	"time"

	"go.uber.org/zap"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/oktaapi"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// defaultMaxRetries only applies where job.Retry is nil (25 is Faktory's default as well)
const defaultMaxRetries = 25

// Worker is a struct that contains all the dependencies to run worker functions
type Worker struct {
	Store         *storage.Store
	Environment   appconfig.Environment
	EmailService  oddmail.EmailService
	AddressBook   email.AddressBook
	Connections   int
	ProcessJobs   bool
	OktaAPIClient oktaapi.Client
}

type JobWrapper struct {
	Name string
	Job  func(context.Context, ...interface{}) error
}

func (w *Worker) getJobWrappers(ctx context.Context) []JobWrapper {
	return []JobWrapper{
		{
			Name: dailyDigestCronJobName,
			Job:  w.DigestCronJob,
		},
		{
			Name: analyzedAuditJobName,
			Job:  w.AnalyzedAuditJob,
		},
		{
			Name: analyzedAuditBatchJobName,
			Job:  w.AnalyzedAuditBatchJob,
		},
		{
			Name: analyzedAuditBatchJobSuccessName,
			Job:  w.AnalyzedAuditBatchJobSuccess,
		},
		{
			Name: digestEmailBatchJobName,
			Job:  w.DigestEmailBatchJob,
		},
		{
			Name: digestEmailBatchJobSuccessName,
			Job:  w.DigestEmailBatchJobSuccess,
		},
		{
			Name: digestEmailJobName,
			Job:  w.DigestEmailJob,
		},
		{
			Name: aggregatedDigestEmailJobName,
			Job:  w.AggregatedDigestEmailJob,
		},
		{
			Name: translateAuditCronJobName,
			Job:  w.TranslateAuditCronJob,
		},
		{
			Name: translateAuditBatchJobName,
			Job:  w.TranslateAuditBatchJob,
		},
		{
			Name: translateAuditBatchJobSuccessName,
			Job:  w.TranslateAuditBatchJobSuccess,
		},
		{
			Name: translateAuditJobName,
			Job:  w.TranslateAuditJob,
		},
		{
			Name: modelStatusUpdateCronJobName,
			Job:  w.ModelStatusUpdateCronJob,
		},
		{
			Name: modelStatusUpdateBatchJobName,
			Job:  w.ModelStatusUpdateBatchJob,
		},
		{
			Name: modelStatusUpdateBatchJobSuccessName,
			Job:  w.ModelStatusUpdateBatchJobSuccess,
		},
		{
			Name: modelStatusUpdateJobName,
			Job:  w.ModelStatusUpdateJob,
		},
		{
			Name: refreshOktaCronJobName,
			Job:  w.RefreshOktaCronJob,
		},
		{
			Name: updateUserAccountCronJobName,
			Job:  w.UpdateUserAccountCronJob,
		},
		{
			Name: updateUserAccountBatchJobName,
			Job:  w.UpdateUserAccountBatchJob,
		},
		{
			Name: updateUserAccountJobName,
			Job:  w.UpdateUserAccountJob,
		},
	}
}

const (
	// defaultQueue the default queue in Faktory
	defaultQueue string = "default"

	// criticalQueue the critical queue in Faktory
	criticalQueue string = "critical"

	// emailQueue the email queue in Faktory
	emailQueue string = "email"

	// auditTranslateQueue the audit translation queue in Faktory
	auditTranslateQueue string = "auditTranslation"
)

// Work creates, configures, and starts worker
func (w *Worker) Work() {
	if !w.ProcessJobs {
		return
	}

	mgr := faktory_worker.NewManager()

	// Setup Manager
	mgr.Concurrency = w.Connections

	// Faktory sits behind an AWS Network Load Balancer, which silently drops any TCP
	// connection idle for longer than its fixed ~350s timeout (NLBs have no configurable
	// idle_timeout setting, unlike ALBs). The faktory client's default dialer enables TCP
	// keepalive but never sets an explicit period, so it falls back to OS/Go defaults that
	// aren't guaranteed to probe more often than that window. Pooled connections that sit
	// idle between cron ticks can get silently dropped by the NLB and then fail with
	// "write: broken pipe" the next time they're used. Building the pool with a dialer that
	// sets an explicit keepalive period well under 350s keeps pooled connections alive.
	pool, err := faktory.NewPoolWithDialer(mgr.Concurrency+2, &net.Dialer{
		Timeout:   1 * time.Second,
		KeepAlive: 120 * time.Second,
	})
	if err != nil {
		panic(fmt.Errorf("failed to create faktory connection pool: %w", err))
	}
	mgr.Pool = pool

	// pull jobs from these queues, in this order of precedence
	mgr.ProcessStrictPriorityQueues(criticalQueue, defaultQueue, auditTranslateQueue, emailQueue)
	mgr.Use(FaktoryLoggerMiddleware())

	zapLogger := appconfig.MustInitializeLogger(w.Environment)
	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	// Initialize data loaders and attach them to the context
	dataLoaders := loaders.NewDataLoaders(w.Store)
	ctx = loaders.CTXWithLoaders(ctx, dataLoaders)

	userFunction := userhelpers.UserAccountGetByIDLOADER
	ctx = appcontext.WithUserAccountService(ctx, userFunction)

	// Register jobs using JobWrapper
	for _, job := range w.getJobWrappers(ctx) {
		zapLogger.Info("registering job", zap.String("job_name", job.Name))
		mgr.Register(job.Name, JobWithPanicProtection(job.Job))
	}

	// Run the manager with the shared context
	err = mgr.RunWithContext(ctx)
	if err != nil {
		panic(err)
	}
}
