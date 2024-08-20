package worker

import (
	"fmt"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
)

// ModelStatusUpdateBatchJob is the job the cron job initiates to check if models need a status update.
// It will batch all child jobs, and when complete it will fire a callback
func (suite *WorkerSuite) TestModelStatusUpdateBatchJob() {
	worker := &Worker{
		Store:  suite.testConfigs.Store,
		Logger: suite.testConfigs.Logger,
	}
	pool, err := faktory.NewPool(10)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	plan1 := suite.createModelPlan("Test Plan 1")
	plan2 := suite.createModelPlan("Test Plan 2")
	modelPlanIDs := []uuid.UUID{plan1.ID, plan2.ID}
	cronJob := faktory.NewJob(modelStatusUpdateBatchJobName)
	cronJob.Queue = criticalQueue
	err = perf.Execute(cronJob, worker.ModelStatusUpdateBatchJob)
	suite.NoError(err)

	err = pool.With(func(cl *faktory.Client) error {
		queues, err2 := cl.QueueSizes()
		suite.NoError(err2)

		modelStatusJobCount := queues[criticalQueue]
		// There are 2 jobs in the critical queue (for both model plans)
		suite.EqualValues(modelStatusJobCount, 2)

		// job1, err2 := cl.Fetch(criticalQueue)
		// suite.NoError(err2)

		// // Get Batch ID
		// var batchID string := job1.Custom["bid"].(string)
		// // complete job
		// err = cl.Ack(job1.Jid)
		// suite.NoError(err)
		var batchID string

		for i := uint64(0); i < modelStatusJobCount; i++ {
			currentJob, err3 := cl.Fetch(criticalQueue)
			suite.NoError(err3)
			suite.NotNil(currentJob)
			// Verify Arg Count
			if suite.Len(currentJob.Args, 1) {
				uuidArg := currentJob.Args[0]
				if suite.IsTypef("string", uuidArg, "the translated audit job is not a string, it is type %T", uuidArg) {
					parsedUUID, err4 := uuid.Parse(fmt.Sprint(uuidArg))
					if suite.NoError(err4, "%v, cannot be parsed to a UUID", uuidArg) {
						suite.Containsf(modelPlanIDs, parsedUUID, "the model status update job doesn't contain the expected modelPlanID. Expected %v, provided %s", modelPlanIDs, parsedUUID)
					}
				}
			}
			//complete job
			batchID = fmt.Sprint(currentJob.Custom["bid"])
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
		suite.Equal(modelStatusUpdateBatchJobSuccessName, callbackJob.Type)
		err = cl.Ack(callbackJob.Jid)
		suite.NoError(err)
		return nil
	})
	suite.NoError(err)
}
