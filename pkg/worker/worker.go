package worker

import (
	"fmt"

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
}

// Work creates, configues, and starts worker
func (w *Worker) Work() {
	// create manager
	mgr := faktory_worker.NewManager()
	mgr.Concurrency = 20
	// pull jobs from these queues, in this order of precedence
	mgr.ProcessStrictPriorityQueues("critical", "default")

	// register jobs here
	mgr.Register("AnalyzedAuditJob", w.AnalyzedAuditJob)
	mgr.Register("DailyDigestEmailJob", w.DailyDigestEmailJob)

	err := mgr.Run()
	if err != nil {
		fmt.Println(err)
	}
}
