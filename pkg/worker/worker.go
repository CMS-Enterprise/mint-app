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
	EmailTemplateService email.TemplateServiceImpl //TODO: this should probably be the interface
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

	// auditTranslateQueue the audit translation queue in Faktory
	auditTranslateQueue string = "auditTranslation"
)

// These constants represent the names of jobs for translating audits
const (
	// translateAuditBatchJobName is the name of the batch job for translating audits
	translateAuditBatchJobName string = "TranslateAuditBatchJob"

	// translateAuditBatchJobSuccessName is the name of the job that is called when a group of translate Audit Jobs is completed
	translateAuditBatchJobSuccessName string = "TranslateAuditBatchJobSuccess"

	// translateAuditCronJobName is the name of the job called that initiates the translate audit batch job
	translateAuditCronJobName string = "TranslateAuditCronJob"

	// translateAuditJobName is the name of the job that creates a translated audit from an audit
	translateAuditJobName string = "TranslateAuditJob"
)

// These constants represent the names of jobs for analyzing audits
const (
	analyzedAuditJobName             string = "AnalyzedAuditJob"
	analyzedAuditBatchJobName        string = "AnalyzedAuditBatchJob"
	analyzedAuditBatchJobSuccessName string = "AnalyzedAuditBatchJobSuccess"
)

const (
	dailyDigestCronJobName         string = "DailyDigestCronJob"
	digestEmailBatchJobName        string = "DigestEmailBatchJob"
	digestEmailBatchJobSuccessName string = "DigestEmailBatchJobSuccess"
	digestEmailJobName             string = "DigestEmailJob"
	aggregatedDigestEmailJobName   string = "AggregatedDigestEmailJob"
)

const (
	modelStatusUpdateCronJobName         string = "ModelStatusUpdateCronJob"
	modelStatusUpdateBatchJobName        string = "ModelStatusUpdateBatchJob"
	modelStatusUpdateBatchJobSuccessName string = "ModelStatusUpdateBatchJobSuccess"
	modelStatusUpdateJobName             string = "ModelStatusUpdateJob"
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

	// register jobs here
	mgr.Register(dailyDigestCronJobName, JobWithPanicProtection(w.DigestCronJob))

	mgr.Register(analyzedAuditJobName, JobWithPanicProtection(w.AnalyzedAuditJob))
	mgr.Register(analyzedAuditBatchJobName, JobWithPanicProtection(w.AnalyzedAuditBatchJob))
	mgr.Register(analyzedAuditBatchJobSuccessName, JobWithPanicProtection(w.AnalyzedAuditBatchJobSuccess))

	mgr.Register(digestEmailBatchJobName, JobWithPanicProtection(w.DigestEmailBatchJob))
	mgr.Register(digestEmailBatchJobSuccessName, JobWithPanicProtection(w.DigestEmailBatchJobSuccess))
	mgr.Register(digestEmailJobName, JobWithPanicProtection(w.DigestEmailJob))
	mgr.Register(aggregatedDigestEmailJobName, JobWithPanicProtection(w.AggregatedDigestEmailJob))

	mgr.Register(translateAuditCronJobName, JobWithPanicProtection(w.TranslateAuditCronJob))
	mgr.Register(translateAuditBatchJobName, JobWithPanicProtection(w.TranslateAuditBatchJob))
	mgr.Register(translateAuditBatchJobSuccessName, JobWithPanicProtection(w.TranslateAuditBatchJobSuccess))
	mgr.Register(translateAuditJobName, JobWithPanicProtection(w.TranslateAuditJob))

	mgr.Register(modelStatusUpdateCronJobName, JobWithPanicProtection(w.ModelStatusUpdateCronJob))
	mgr.Register(modelStatusUpdateBatchJobName, JobWithPanicProtection(w.ModelStatusUpdateBatchJob))
	mgr.Register(modelStatusUpdateBatchJobSuccessName, JobWithPanicProtection(w.ModelStatusUpdateBatchJobSuccess))

	/**********************
	* //Future Enhancement
	* Consider providing workers with dataloaders, and potentially a shared context. As these run separate go routines for each worker,
	***********************
	*dataLoaders := loaders.NewDataLoaders(w.Store)
	*ctx := loaders.CTXWithLoaders(context.Background(), dataLoaders)
	*err := mgr.RunWithContext(ctx)
	******************************/

	/**********************
	* // Future Enhancement
	Re-work this to consider wrapping a representation of the job with the name of the job itself. Consider a struct that is built with both a name and function.
	This requires rework because all jobs are currently methods on a worker, instead of functions that take a worker

	Something like:
		// var TranslateAuditJob = JobWrapper{
		// 	Name: "TranslateAuditJob",
		// 	Job:  ,
		// }

	******************************/

	err := mgr.Run()
	if err != nil {
		panic(err)
	}
}
