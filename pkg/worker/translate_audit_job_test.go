package worker

import (
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"

	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func (suite *WorkerSuite) TestTranslateAuditJob() {

	worker := &Worker{
		Store:  suite.testConfigs.Store,
		Logger: suite.testConfigs.Logger,
	}
	// Create plan
	plan := suite.createModelPlan("Test Plan")

	readyToQueueEntries, err := storage.TranslatedAuditQueueGetEntriesToQueue(suite.testConfigs.Store)
	suite.NoError(err)
	now := time.Now()

	audits, err := suite.testConfigs.Store.AuditChangeCollectionByPrimaryKeyOrForeignKeyAndDate(suite.testConfigs.Logger, plan.ID, plan.ID, now, models.SortDesc)
	suite.NoError(err)

	auditToAnalyze := audits[0]

	testableEntries := lo.Filter(readyToQueueEntries, func(queue *models.TranslatedAuditQueue, _ int) bool {
		return queue.ChangeID == auditToAnalyze.ID
	})
	suite.NotNil(testableEntries)
	if len(testableEntries) < 1 {
		suite.Fail("expected testable entries to have at least one element")
	}
	entryToTest := testableEntries[0]

	pool, err := faktory.NewPool(5)
	suite.NoError(err)
	job := faktory.NewJob(translateAuditJobName, entryToTest.ChangeID, entryToTest.ID)
	perf := faktory_worker.NewTestExecutor(pool)
	jobErr := perf.Execute(job, worker.TranslateAuditJob)
	suite.NoError(jobErr)

	suite.NoError(jobErr)
}
