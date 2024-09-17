package worker

import (
	"strings"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"

	"github.com/golang/mock/gomock"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

func (suite *WorkerSuite) TestAggregatedDigestEmail() {

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

	var analyzedAudits []*models.AnalyzedAudit
	modelNameChange := "Old Name"
	modelStatusChange := []string{"OMB_ASRF_CLEARANCE"}
	documentCount := 2
	crTdlAvtivity := true
	updatedSections := []models.TableName{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []models.TableName{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []models.TableName{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []models.AnalyzedModelLeadInfo{{CommonName: "New Lead"}}
	dicussionActivity := true

	auditChange := *suite.createAnalyzedAuditChange(modelNameChange, modelStatusChange, documentCount,
		crTdlAvtivity, updatedSections, reviewSections, clearanceSections, addedLead, dicussionActivity)

	analyzedAudit := suite.createAnalyzedAudit(mp, time.Now().UTC(), auditChange)

	// Test getAggregatedDailyDigestAnalyzedAudits
	analyzedAudits, err := getUserAgnosticDigestAnalyzedAudits(time.Now().UTC(), worker.Store, worker.Logger)
	suite.Equal(analyzedAudit.ID, analyzedAudits[0].ID)
	suite.NoError(err)

	// Test generateAggregatedDailyDigestEmail email to check content
	humanized := analyzedAudits[0].Changes.HumanizedSubset(5)
	emailSubject, emailBody, err := generateUserAgnosticDigestEmail(
		analyzedAudits,
		worker.EmailTemplateService,
		mockEmailService,
	)
	suite.NoError(err)
	suite.NotNil(emailSubject)
	suite.NotNil(emailBody)
	suite.EqualValues("Daily updates on Model Plans", emailSubject)

	// Check if email contains model name
	suite.True(strings.Contains(emailBody, mp.ModelName))
	// Check if email contains humanized sentences
	lo.ForEach(humanized, func(h string, _ int) {
		h = strings.Replace(h, "+", "&#43;", -1)
		suite.True(strings.Contains(emailBody, h))
	})

	// Test AggregatedDailyDigestEmailJob / sending email
	mockEmailService.
		EXPECT().
		Send(
			gomock.Any(),
			gomock.Eq([]string{addressBook.MINTTeamEmail}),
			gomock.Any(),
			gomock.Eq(emailSubject),
			gomock.Any(),
			gomock.Eq(emailBody),
		).MinTimes(1).MaxTimes(1)

	pool, err2 := faktory.NewPool(1)
	suite.NoError(err2)
	perf := faktory_worker.NewTestExecutor(pool)
	job := faktory.NewJob(aggregatedDigestEmailJobName, time.Now().UTC().Format("2006-01-02"), collaborator.UserID.String()) // pass user id as string because that is how it is returned from Faktory
	jobErr := perf.Execute(job, worker.AggregatedDigestEmailJob)
	suite.NoError(jobErr)

	mockController.Finish()
}
