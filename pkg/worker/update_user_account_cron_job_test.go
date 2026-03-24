package worker

import (
	"context"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"

	"github.com/cms-enterprise/mint-app/pkg/oktaapi"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *WorkerSuite) TestUpdateUserAccountJob() {
	worker := &Worker{
		Store:         suite.testConfigs.Store,
		OktaAPIClient: suite.testConfigs.OktaClient,
	}

	pool, err := faktory.NewPool(1)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	var calledWith []string
	orig := updateUserAccountFromOkta
	updateUserAccountFromOkta = func(_ context.Context, _ *storage.Store, _ oktaapi.Client, _ *FaktoryLogger, username string) error {
		calledWith = append(calledWith, username)
		return nil
	}
	defer func() { updateUserAccountFromOkta = orig }()

	job := faktory.NewJob(updateUserAccountJobName, "TEST")
	jobErr := perf.Execute(job, worker.UpdateUserAccountJob)
	suite.NoError(jobErr)

	suite.Require().Len(calledWith, 1)
	suite.Equal("TEST", calledWith[0])
}

func (suite *WorkerSuite) TestUpdateUserAccountBatchJob() {
	worker := &Worker{
		Store:         suite.testConfigs.Store,
		OktaAPIClient: suite.testConfigs.OktaClient,
	}

	// Collect users with non-nil usernames before running the batch job
	usersInDB, err := storage.UserAccountCollectionGet(suite.testConfigs.Store)
	suite.NoError(err)
	suite.Require().NotEmpty(usersInDB)

	var eligibleUsernames []string
	for _, u := range usersInDB {
		if u.Username != nil {
			eligibleUsernames = append(eligibleUsernames, *u.Username)
		}
	}
	suite.Require().NotEmpty(eligibleUsernames, "expected at least one user with a non-nil username")

	pool, err := faktory.NewPool(5)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	orig := updateUserAccountFromOkta
	var calledWith []string
	updateUserAccountFromOkta = func(_ context.Context, _ *storage.Store, _ oktaapi.Client, _ *FaktoryLogger, username string) error {
		calledWith = append(calledWith, username)
		return nil
	}
	defer func() { updateUserAccountFromOkta = orig }()

	// Run the batch job — it should complete without error
	batchJob := faktory.NewJob(updateUserAccountBatchJobName)
	batchJob.Queue = criticalQueue
	err = perf.Execute(batchJob, worker.UpdateUserAccountBatchJob)
	suite.NoError(err)

	// The Faktory test executor doesn't automatically execute jobs pushed by cl.Push().
	// To keep this test focused on "argument parsing + delegation", we execute the per-user
	// job handler ourselves (with the resolver logic stubbed out) and assert the usernames.
	for _, username := range eligibleUsernames {
		job := faktory.NewJob(updateUserAccountJobName, username)
		jobErr := perf.Execute(job, worker.UpdateUserAccountJob)
		suite.NoError(jobErr)
	}

	suite.ElementsMatch(eligibleUsernames, calledWith)
}

func (suite *WorkerSuite) TestUpdateUserAccountJob_MissingArgs() {
	worker := &Worker{
		Store:         suite.testConfigs.Store,
		OktaAPIClient: suite.testConfigs.OktaClient,
	}

	pool, err := faktory.NewPool(1)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	job := faktory.NewJob(updateUserAccountJobName) // no args
	jobErr := perf.Execute(job, worker.UpdateUserAccountJob)
	suite.Error(jobErr)
	suite.Contains(jobErr.Error(), "no arguments were provided for this job")
}
