package worker

import (
	"time"

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

	jobErr := worker.TranslateAuditJob(suite.testConfigs.Context, entryToTest.ChangeID, entryToTest.ID)

	suite.NoError(jobErr)
}
