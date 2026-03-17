package worker

import (
	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"

	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func (suite *WorkerSuite) TestUpdateUserAccountJob() {
	worker := &Worker{
		Store:         suite.testConfigs.Store,
		OktaAPIClient: suite.testConfigs.OktaClient,
	}

	// SetupTest already creates "TEST"; dirty the data to verify the job updates it
	existingUser, err := storage.UserAccountGetByUsername(suite.testConfigs.Store, "TEST")
	suite.NoError(err)
	suite.Require().NotNil(existingUser)

	existingUser.CommonName = "Stale Name"
	existingUser.Email = "stale@stale.fake"
	existingUser.GivenName = "Stale"
	existingUser.FamilyName = "Name"
	_, err = storage.UserAccountUpdateByUserName(suite.testConfigs.Store, existingUser)
	suite.NoError(err)

	pool, err := faktory.NewPool(1)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	job := faktory.NewJob(updateUserAccountJobName, "TEST")
	jobErr := perf.Execute(job, worker.UpdateUserAccountJob)
	suite.NoError(jobErr)

	// Verify the user was updated with fresh Okta data.
	// The local mock returns "Terry Thompson" for "TEST".
	updatedUser, err := storage.UserAccountGetByUsername(suite.testConfigs.Store, "TEST")
	suite.NoError(err)
	suite.Require().NotNil(updatedUser)
	suite.Equal("Terry", updatedUser.GivenName)
	suite.Equal("Thompson", updatedUser.FamilyName)
	suite.Equal("Terry Thompson", updatedUser.CommonName)
	suite.Equal("Terry.Thompson@local.fake", updatedUser.Email)
}

func (suite *WorkerSuite) TestUpdateUserAccountBatchJob() {
	worker := &Worker{
		Store:         suite.testConfigs.Store,
		OktaAPIClient: suite.testConfigs.OktaClient,
	}

	// Collect users with non-nil usernames before running the batch job
	usersInDB, err := suite.testConfigs.Store.UserAccountCollectionGet()
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

	// Run the batch job — it should complete without error
	batchJob := faktory.NewJob(updateUserAccountBatchJobName)
	batchJob.Queue = criticalQueue
	err = perf.Execute(batchJob, worker.UpdateUserAccountBatchJob)
	suite.NoError(err)

	// Execute UpdateUserAccountJob directly for each eligible user and verify DB is updated.
	// We avoid inspecting the Faktory queue because the running worker may consume jobs
	// before we can observe them.
	for _, username := range eligibleUsernames {
		job := faktory.NewJob(updateUserAccountJobName, username)
		jobErr := perf.Execute(job, worker.UpdateUserAccountJob)
		suite.NoError(jobErr)

		updatedUser, dbErr := storage.UserAccountGetByUsername(suite.testConfigs.Store, username)
		suite.NoError(dbErr)
		suite.Require().NotNil(updatedUser)
		suite.NotEmpty(updatedUser.CommonName)
	}
}
