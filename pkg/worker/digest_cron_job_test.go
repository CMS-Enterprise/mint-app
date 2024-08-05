package worker

import (
	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

func (suite *WorkerSuite) TestDigestCronJobIntegration() {
	worker := &Worker{
		Store:  suite.testConfigs.Store,
		Logger: suite.testConfigs.Logger,
	}

	pool, err := faktory.NewPool(5)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	// Test when DigestCronJob runs it enqueues
	// analyzedAuditBatchJob (1 job in queue)
	cronJob := faktory.NewJob(dailyDigestCronJobName, "")
	cronJob.Queue = criticalQueue

	err = perf.Execute(cronJob, worker.DigestCronJob)
	suite.NoError(err)

	err = pool.With(func(cl *faktory.Client) error {
		queues, err2 := cl.QueueSizes()
		suite.NoError(err2)
		suite.True(queues[criticalQueue] == 1)
		return err2
	})

	suite.NoError(err)
}
