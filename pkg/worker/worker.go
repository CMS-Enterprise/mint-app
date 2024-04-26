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
)

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

//Changes: (Job) If possible define all jobs like this so they can be referenced. To do that, they can't be receivers though...
// var TranslateAuditJob = JobWrapper{
// 	Name: "TranslateAuditJob",
// 	Job:  ,
// }

// Work creates, configures, and starts worker
func (w *Worker) Work() {
	if !w.ProcessJobs {
		return
	}

	mgr := faktory_worker.NewManager()

	// Setup Manager
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

	mgr.Register(translateAuditCronJobName, w.TranslateAuditCronJob)
	mgr.Register(translateAuditBatchJobName, w.TranslateAuditBatchJob)
	mgr.Register(translateAuditBatchJobSuccessName, w.TranslateAuditBatchJobSuccess)
	mgr.Register(translateAuditJobName, w.TranslateAuditJob)

	/**********************
	* //Future Enhancement
	* Consider providing workers with dataloaders, and potentially a shared context. As these run separate go routines for each worker,
	***********************
	*dataLoaders := loaders.NewDataLoaders(w.Store)
	*ctx := loaders.CTXWithLoaders(context.Background(), dataLoaders)
	*err := mgr.RunWithContext(ctx)
	******************************/

	err := mgr.Run()
	if err != nil {
		panic(err)
	}
}
