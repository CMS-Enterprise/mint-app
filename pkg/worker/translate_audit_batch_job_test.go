package worker

import (
	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

func (suite *WorkerSuite) TestTranslateAuditBatchJob() {

	worker := &Worker{
		Store:  suite.testConfigs.Store,
		Logger: suite.testConfigs.Logger,
	}

	// Changes (Job) Assert that you can parse the job params.

	pool, err := faktory.NewPool(10)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	suite.createModelPlan("Test Plan")

	cronJob := faktory.NewJob(translateAuditBatchJobName)
	cronJob.Queue = criticalQueue

	// Assert the batch job runs without error
	err = perf.Execute(cronJob, worker.TranslateAuditBatchJob)
	suite.NoError(err)

	err = pool.With(func(cl *faktory.Client) error {
		// Assert that the Batch Job Creates Translate Audit Jobs
		queues, err2 := cl.QueueSizes()
		suite.NoError(err2)
		// There is nothing in the critical queue
		suite.True(queues[criticalQueue] == 0)
		translationJobCount := queues[auditTranslateQueue]
		// There are jobs in the audit translation queue (model plan creates many entries)
		suite.GreaterOrEqual(translationJobCount, uint64(10))

		job1, err2 := cl.Fetch(auditTranslateQueue)
		suite.NoError(err2)

		// Get Batch ID
		batchID := job1.Custom["bid"].(string)
		// complete job
		err = cl.Ack(job1.Jid)
		suite.NoError(err)

		for i := uint64(0); i < translationJobCount-1; i++ {
			currentJob, err3 := cl.Fetch(auditTranslateQueue)
			suite.NoError(err3)
			suite.NotNil(currentJob)

			//complete job
			err3 = cl.Ack(currentJob.Jid)
			suite.NoError(err3)
		}
		// All jobs should be complete now

		// Check callback
		batchStatusComplete, err2 := cl.BatchStatus(batchID)
		suite.NoError(err2)
		suite.Equal("2", batchStatusComplete.CompleteState)

		callbackJob, err2 := cl.Fetch(criticalQueue)
		suite.NoError(err2)
		suite.Equal(translateAuditBatchJobSuccessName, callbackJob.Type)
		err = cl.Ack(callbackJob.Jid)
		suite.NoError(err)
		return nil
	})
	suite.NoError(err)
}
