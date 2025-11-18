package worker

import (
	"context"

	"go.uber.org/zap"

	faktory_worker "github.com/contribsys/faktory_worker_go"

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
	Store                *storage.Store
	Logger               *zap.Logger
	EmailService         oddmail.EmailService
	EmailTemplateService email.TemplateServiceImpl //TODO: this should probably be the interface
	AddressBook          email.AddressBook
	Connections          int
	ProcessJobs          bool
	OktaAPIClient        oktaapi.Client
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

	// pull jobs from these queues, in this order of precedence
	mgr.ProcessStrictPriorityQueues(criticalQueue, defaultQueue, auditTranslateQueue, emailQueue)

	// Initialize data loaders and attach them to the context
	dataLoaders := loaders.NewDataLoaders(w.Store)
	ctx := loaders.CTXWithLoaders(context.Background(), dataLoaders)

	userFunction := userhelpers.UserAccountGetByIDLOADER
	ctx = appcontext.WithUserAccountService(ctx, userFunction)

	// Register jobs using JobWrapper
	for _, job := range w.getJobWrappers(ctx) {
		w.Logger.Info("registering job", zap.String("job_name", job.Name))
		mgr.Register(job.Name, JobWithPanicProtection(job.Job))
	}

	// Run the manager with the shared context
	err := mgr.RunWithContext(ctx)
	if err != nil {
		panic(err)
	}
}
