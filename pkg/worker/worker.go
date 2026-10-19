package worker

import (
	"context"
	"crypto/rand"
	"fmt"
	"math/big"
	"net"
	"os/signal"
	"syscall"
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

	// StartupDelayMaxSeconds is the upper bound of a random delay before Work() opens its
	// Faktory connection pool. 0 disables the delay.
	StartupDelayMaxSeconds int
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
			Name: prepareForClearanceCronJobName,
			Job:  w.PrepareForClearanceCronJob,
		},
		{
			Name: prepareForClearanceBatchJobName,
			Job:  w.PrepareForClearanceBatchJob,
		},
		{
			Name: prepareForClearanceBatchJobSuccessName,
			Job:  w.PrepareForClearanceBatchJobSuccess,
		},
		{
			Name: prepareForClearanceJobName,
			Job:  w.PrepareForClearanceJob,
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

	zapLogger := appconfig.MustInitializeLogger(w.Environment)
	ctx := appcontext.WithLogger(context.Background(), zapLogger)

	// RunWithContext only shuts down when its context is canceled - it otherwise ignores OS
	// signals entirely (unlike mgr.Run()). Without this, ECS's SIGTERM on every deploy/task
	// replacement goes unhandled and the process is eventually SIGKILLed, which never gives
	// mgr.Terminate() a chance to run and close the pooled Faktory connections. Those
	// connections then linger on the Faktory server until it reaps them itself, and repeated
	// deploys without that cleanup accumulate until the server hits its connection limit.
	//
	// Built this early (rather than right before RunWithContext) so the startup delay below is
	// itself cancelable by SIGTERM/SIGINT - a task torn down mid-delay (e.g. a rolled-back
	// deploy) should exit right away instead of sitting out the rest of the delay first.
	ctx, stop := workerShutdownContext(ctx)
	defer stop()

	// On a rolling deploy, the new task's full connection burst (mgr.Concurrency+2 below) can
	// briefly overlap with the outgoing task's pool before it finishes shutting down, and both
	// compete for Faktory's limited connection allowance (INC1969969). A random delay here
	// spreads that burst out so it's less likely to land in the same instant as the old task's
	// shutdown - this narrows the collision window, it doesn't eliminate it. Zero (the default
	// when unset) disables the delay.
	if err := waitForStartupDelay(ctx, w.StartupDelayMaxSeconds, zapLogger); err != nil {
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

	// Run the manager with the shared context; canceling ctx above (via SIGTERM/SIGINT)
	// makes RunWithContext call mgr.Terminate(), which drains in-flight jobs and closes
	// the connection pool before this returns.
	err = mgr.RunWithContext(ctx)
	if err != nil {
		panic(err)
	}
}

// waitForStartupDelay sleeps for a random duration in [0, maxDelaySeconds) seconds, returning
// early with ctx.Err() if ctx is canceled first. maxDelaySeconds <= 0 disables the delay.
func waitForStartupDelay(ctx context.Context, maxDelaySeconds int, logger *zap.Logger) error {
	if maxDelaySeconds <= 0 {
		return nil
	}

	delaySeconds, err := rand.Int(rand.Reader, big.NewInt(int64(maxDelaySeconds)))
	if err != nil {
		logger.Warn("failed to generate faktory startup delay, skipping it", zap.Error(err))
		return nil
	}

	delay := time.Duration(delaySeconds.Int64()) * time.Second
	if delay <= 0 {
		return ctx.Err()
	}

	logger.Info("delaying faktory worker startup", zap.Duration("delay", delay))
	select {
	case <-time.After(delay):
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

// workerShutdownContext returns a context that is canceled when the process receives
// SIGTERM or SIGINT, so that mgr.RunWithContext can shut down gracefully instead of
// running until the process is forcibly killed.
func workerShutdownContext(ctx context.Context) (context.Context, context.CancelFunc) {
	return signal.NotifyContext(ctx, syscall.SIGTERM, syscall.SIGINT)
}
