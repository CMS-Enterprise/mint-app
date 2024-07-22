package worker

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/email"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/golang/mock/gomock"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// Faktory integration tests
func (suite *WorkerSuite) TestDigestEmailBatchJobIntegration() {
	worker := &Worker{
		Store:  suite.testConfigs.Store,
		Logger: suite.testConfigs.Logger,
	}

	date := time.Now().UTC().Format("2006-01-02")
	//Create Plans
	mp := suite.createModelPlan("Test Plan")
	collaborator := suite.createPlanCollaborator(
		mp,
		"MINT",
		"Test User",
		[]models.TeamRole{models.TeamRoleModelLead},
		"testuser@email.com",
	)
	emails := []string{collaborator.UserID.String(), suite.testConfigs.Principal.Account().ID.String()}
	// SHOULD EMAIL CREATOR OF PLAN AND COLLABORATOR

	modelNameChange := "Old Name"
	modelStatusChange := []string{"OMB_ASRF_CLEARANCE"}
	documentCount := 2
	crTdlActivity := true
	updatedSections := []models.TableName{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []models.TableName{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []models.TableName{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []models.AnalyzedModelLeadInfo{{CommonName: "New Lead", ID: collaborator.ID}}
	discussionActivity := true

	auditChange := *suite.createAnalyzedAuditChange(modelNameChange, modelStatusChange, documentCount,
		crTdlActivity, updatedSections, reviewSections, clearanceSections, addedLead, discussionActivity)

	suite.createAnalyzedAudit(mp, time.Now().UTC(), auditChange)

	pool, err := faktory.NewPool(10)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	// Test when DigestEmailBatchJob runs it enqueues
	// the correct number of DigestEmailJobs (1 job per user (2))
	batchJob := faktory.NewJob(digestEmailBatchJobName, date)
	batchJob.Queue = criticalQueue

	err = perf.Execute(batchJob, worker.DigestEmailBatchJob)
	suite.NoError(err)

	err = pool.With(func(cl *faktory.Client) error {
		queueSize, err2 := cl.QueueSizes()
		suite.NoError(err2)
		suite.True(queueSize[emailQueue] == 3)

		// Check jobs arguments equal are correct userID and  date
		job1, err2 := cl.Fetch(emailQueue)
		suite.NoError(err2)

		// Get Batch ID
		batchID := job1.Custom["bid"].(string)

		suite.NoError(err2)
		suite.Equal(emailQueue, job1.Queue)
		suite.Equal(date, job1.Args[0].(string))
		suite.True(lo.Contains(emails, job1.Args[1].(string)))

		job2, err2 := cl.Fetch(emailQueue)
		suite.NoError(err2)
		suite.Equal(emailQueue, job2.Queue)
		suite.Equal(date, job2.Args[0].(string))
		suite.True(lo.Contains(emails, job2.Args[1].(string)))

		job3, err3 := cl.Fetch(emailQueue)
		suite.NoError(err3)
		suite.Equal(emailQueue, job3.Queue)
		suite.Equal(date, job3.Args[0].(string))

		// Check Batch Job
		batchStatusPending, err2 := cl.BatchStatus(batchID)
		suite.NoError(err2)
		// pending
		suite.Equal("", batchStatusPending.CompleteState)
		// complete jobs
		err = cl.Ack(job1.Jid)
		suite.NoError(err)
		err2 = cl.Ack(job2.Jid)
		suite.NoError(err2)

		err3 = cl.Ack(job3.Jid)
		suite.NoError(err3)

		// Check callback
		batchStatusComplete, err2 := cl.BatchStatus(batchID)
		suite.NoError(err2)
		suite.Equal("2", batchStatusComplete.CompleteState)

		callbackJob, err2 := cl.Fetch(defaultQueue)
		suite.Equal(digestEmailBatchJobSuccessName, callbackJob.Type)

		return err2
	})

	suite.NoError(err)
}

// TestDigestEmailJobIntegration ensures the Digest email job works as expected with Faktory.
// It is not responsible for testing the code called by the job, but simply to make sure it runs with faktory without an error.
func (suite *WorkerSuite) TestDigestEmailJobIntegration() {
	// Setup email
	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)

	addressBook := email.AddressBook{
		DefaultSender: "unit-test-execution@mint.cms.gov",
	}

	emailServiceConfig := &oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(emailServiceConfig).
		AnyTimes()

	worker := &Worker{
		Store:                suite.testConfigs.Store,
		Logger:               suite.testConfigs.Logger,
		EmailService:         mockEmailService,
		EmailTemplateService: suite.testConfigs.EmailTemplateService,
		AddressBook:          addressBook,
	}

	date := time.Now().UTC().Format("2006-01-02")

	//Create Plans
	mp := suite.createModelPlan("Test Plan")
	collaborator := suite.createPlanCollaborator(
		mp,
		"MINT",
		"Test User",
		[]models.TeamRole{models.TeamRoleModelLead},
		"testuser@email.com",
	)
	collaboratorAccount, err := storage.UserAccountGetByID(suite.testConfigs.Store, collaborator.UserID)
	suite.NoError(err)

	modelNameChange := "Old Name"
	modelStatusChange := []string{"OMB_ASRF_CLEARANCE"}
	documentCount := 2
	crTdlActivity := true
	updatedSections := []models.TableName{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []models.TableName{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []models.TableName{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []models.AnalyzedModelLeadInfo{{CommonName: "New Lead", ID: collaborator.ID}}
	discussionActivity := true

	auditChange := *suite.createAnalyzedAuditChange(modelNameChange, modelStatusChange, documentCount,
		crTdlActivity, updatedSections, reviewSections, clearanceSections, addedLead, discussionActivity)

	suite.createAnalyzedAudit(mp, time.Now().UTC(), auditChange)

	pool, err := faktory.NewPool(5)
	suite.NoError(err)

	// Test when DigestEmailJob runs it enqueues
	// the with the correct args
	job := faktory.NewJob("DigestEmailJob", date, collaborator.UserID)
	job.Queue = emailQueue

	err = pool.With(func(cl *faktory.Client) error {
		err2 := cl.Push(job)
		suite.NoError(err2)

		queues, err2 := cl.QueueSizes()
		suite.NoError(err2)
		suite.True(queues[emailQueue] == 1)

		// Check jobs arguments equal are correct userID and date
		job1, err2 := cl.Fetch(emailQueue)

		suite.NoError(err2)
		suite.Equal(emailQueue, job1.Queue)
		suite.Equal(date, job1.Args[0].(string))
		suite.EqualValues(collaborator.UserID.String(), job1.Args[1].(string))

		// Make sure email sent
		mockEmailService.
			EXPECT().
			Send(
				gomock.Any(),
				gomock.Eq([]string{collaboratorAccount.Email}),
				gomock.Any(),
				gomock.Any(),
				gomock.Any(),
				gomock.Any(),
			).MinTimes(1).MaxTimes(1)

		// Test job run
		pool, err2 := faktory.NewPool(5)
		suite.NoError(err2)
		perf := faktory_worker.NewTestExecutor(pool)

		err2 = perf.Execute(job1, worker.DigestEmailJob)
		suite.NoError(err2)

		return err2
	})
	suite.NoError(err)
}
