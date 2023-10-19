package worker

import (
	"context"
	"strings"
	"time"

	"github.com/cmsgov/mint-app/pkg/email"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/golang/mock/gomock"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

func (suite *WorkerSuite) TestDigestEmail() {

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

	mp := suite.createModelPlan("Test Plan")
	collaborator := suite.createPlanCollaborator(
		mp,
		"MINT",
		"Test User",
		[]models.TeamRole{models.TeamRoleModelLead},
		"testuser@email.com",
	)
	collaboratorAccount, err := suite.testConfigs.Store.UserAccountGetByID(collaborator.UserID)
	suite.NoError(err)

	var analyzedAudits []*models.AnalyzedAudit
	modelNameChange := "Old Name"
	modelStatusChange := []string{"OMB_ASRF_CLEARANCE"}
	documentCount := 2
	crTdlAvtivity := true
	updatedSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []string{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []models.AnalyzedModelLeadInfo{{CommonName: "New Lead"}}
	dicussionActivity := true

	auditChange := *suite.createAnalyzedAuditChange(modelNameChange, modelStatusChange, documentCount,
		crTdlAvtivity, updatedSections, reviewSections, clearanceSections, addedLead, dicussionActivity)

	analyzedAudit := suite.createAnalyzedAudit(mp, time.Now().UTC(), auditChange)

	// Test getDailyDigestAnalyzedAudits
	analyzedAudits, err = getDigestAnalyzedAudits(collaborator.UserID, time.Now().UTC(), worker.Store, worker.Logger)
	suite.Equal(analyzedAudit.ID, analyzedAudits[0].ID)
	suite.NoError(err)

	// Test generateDailyDigestEmail email to check content
	humanized := analyzedAudits[0].Changes.HumanizedSubset(5)
	emailSubject, emailBody, err := generateDigestEmail(analyzedAudits, worker.EmailTemplateService, worker.EmailService)
	suite.NoError(err)
	suite.NotNil(emailSubject)
	suite.NotNil(emailBody)
	suite.EqualValues("Updates on the models you're following", emailSubject)

	// Check if email contains model name
	suite.True(strings.Contains(emailBody, mp.ModelName))
	// Check if email contains humanized sentences
	lo.ForEach(humanized, func(h string, _ int) {
		h = strings.Replace(h, "+", "&#43;", -1)
		suite.True(strings.Contains(emailBody, h))
	})

	// Test DailyDigestEmailJob / sending email
	mockEmailService.
		EXPECT().
		Send(
			gomock.Any(),
			gomock.Eq([]string{collaboratorAccount.Email}),
			gomock.Any(),
			gomock.Eq(emailSubject),
			gomock.Any(),
			gomock.Eq(emailBody),
		).MinTimes(1).MaxTimes(1)

	err = worker.DigestEmailJob(context.Background(), time.Now().UTC().Format("2006-01-02"), collaborator.UserID.String()) // pass user id as string because that is how it is returned from Faktory

	suite.NoError(err)
	mockController.Finish()
}

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
	emails := []string{collaborator.UserID.String(), suite.testConfigs.Principal.Account().ID.String()} //TODO verify that his is correct
	// SHOULD EMAIL CREATOR OF PLAN AND COLLABORATOR

	modelNameChange := "Old Name"
	modelStatusChange := []string{"OMB_ASRF_CLEARANCE"}
	documentCount := 2
	crTdlAvtivity := true
	updatedSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []string{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []models.AnalyzedModelLeadInfo{{CommonName: "New Lead", ID: collaborator.ID}}
	dicussionActivity := true

	auditChange := *suite.createAnalyzedAuditChange(modelNameChange, modelStatusChange, documentCount,
		crTdlAvtivity, updatedSections, reviewSections, clearanceSections, addedLead, dicussionActivity)

	suite.createAnalyzedAudit(mp, time.Now().UTC(), auditChange)

	pool, err := faktory.NewPool(10)
	suite.NoError(err)
	perf := faktory_worker.NewTestExecutor(pool)

	// Test when DigestEmailBatchJob runs it enqueues
	// the correct number of DigestEmailJobs (1 job per user (2))
	batchJob := faktory.NewJob("DigestEmailBatchJob", date)
	batchJob.Queue = criticalQueue

	err = perf.Execute(batchJob, worker.DigestEmailBatchJob)
	suite.NoError(err)

	err = pool.With(func(cl *faktory.Client) error {
		queueSize, err2 := cl.QueueSizes()
		suite.NoError(err2)
		suite.True(queueSize[emailQueue] == 3)

		// Check jobs arguments equal are corrrect userID and  date
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
		suite.Equal("DigestEmailBatchJobSuccess", callbackJob.Type)

		return err2
	})

	suite.NoError(err)
}

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
	// Create Plan
	// 	date := time.Now().UTC().Format("2006-01-02")
	//Create Plans
	mp := suite.createModelPlan("Test Plan")
	collaborator := suite.createPlanCollaborator(
		mp,
		"MINT",
		"Test User",
		[]models.TeamRole{models.TeamRoleModelLead},
		"testuser@email.com",
	)
	collaboratorAccount, err := suite.testConfigs.Store.UserAccountGetByID(collaborator.UserID)
	suite.NoError(err)

	modelNameChange := "Old Name"
	modelStatusChange := []string{"OMB_ASRF_CLEARANCE"}
	documentCount := 2
	crTdlAvtivity := true
	updatedSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []string{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []models.AnalyzedModelLeadInfo{{CommonName: "New Lead", ID: collaborator.ID}}
	dicussionActivity := true

	auditChange := *suite.createAnalyzedAuditChange(modelNameChange, modelStatusChange, documentCount,
		crTdlAvtivity, updatedSections, reviewSections, clearanceSections, addedLead, dicussionActivity)

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

		// Check jobs arguments equal are corrrect userID and date
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
