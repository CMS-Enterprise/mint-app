package worker

import (
	"context"
	"strings"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

func (suite *WorkerSuite) TestDailyDigestEmail() {

	// Setup email
	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	emailServiceConfig := &oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
		DefaultSender: "unit-test-execution@mint.cms.gov",
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
	}

	mp := suite.createModelPlan("Test Plan2")
	collaborator := suite.createPlanCollaborator(mp, "MINT", "Test User", "MODEL_LEAD", "testuser@email.com")

	var analyzedAudits []*models.AnalyzedAudit
	modelNameChange := models.AuditField{
		New: mp.ModelName,
		Old: "Old Name",
	}
	modelStatusChange := []string{"READY_FOR_CLEARANCE"}
	documentCount := 2
	crTdlAvtivity := true
	updatedSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []string{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []string{"New Lead"}
	dicussionActivity := true

	auditChange := *suite.createAnalyzedAuditChange(&modelNameChange, &modelStatusChange, &documentCount,
		&crTdlAvtivity, &updatedSections, &reviewSections, &clearanceSections, &addedLead, &dicussionActivity)

	analyzedAudit := suite.createAnalyzedAudit(mp, time.Now(), auditChange)

	// Test getDailyDigestAnalyzedAudits
	analyzedAudits, err := getDailyDigestAnalyzedAudits(collaborator.EUAUserID, time.Now(), worker.Store, worker.Logger)
	suite.Equal(analyzedAudit.ID, analyzedAudits[0].ID)
	suite.NoError(err)

	// Test generateDailyDigestEmail email to check content
	humanized := analyzedAudits[0].Changes.HumanizedSubset(5)
	emailSubject, emailBody, err := generateDailyDigestEmail(analyzedAudits, worker.EmailTemplateService)
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
			gomock.Eq([]string{collaborator.Email}),
			gomock.Any(),
			gomock.Eq(emailSubject),
			gomock.Any(),
			gomock.Eq(emailBody),
		).AnyTimes()

	err = worker.DailyDigestEmailJob(context.Background(), collaborator.EUAUserID, time.Now())

	mockEmailService.
		EXPECT().
		Send(
			gomock.Any(),
			gomock.Eq([]string{collaborator.Email}),
			gomock.Any(),
			gomock.Eq(emailSubject),
			gomock.Any(),
			gomock.Eq(emailBody),
		).AnyTimes()

	suite.NoError(err)
	mockController.Finish()

}
