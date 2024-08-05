package worker

import (
	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
)

func (suite *WorkerSuite) TestModelStatusUpdateJob() {
	worker := &Worker{
		Store:  suite.testConfigs.Store,
		Logger: suite.testConfigs.Logger,
	}
	// Create plan
	plan := suite.createModelPlan("Test Plan")

	pool, err := faktory.NewPool(1)
	suite.NoError(err)
	// Make a job, provide it the model plan ID as the parameter
	job := faktory.NewJob(modelStatusUpdateJobName, plan.ID)
	perf := faktory_worker.NewTestExecutor(pool)
	// Execute the job and ensure there is no error. Business logic check should be verified in the package it is defined in
	jobErr := perf.Execute(job, worker.ModelStatusUpdateJob)
	suite.NoError(jobErr)
}
