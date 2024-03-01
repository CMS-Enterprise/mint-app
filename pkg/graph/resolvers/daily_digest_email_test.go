package resolvers

import (
	"strings"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/testconfig/emailtestconfigs"
)

func (suite *ResolverSuite) TestDailyDigestNotificationSend() {

	//TODO: EASI-(EASI-3949) see about a mock email template service?
	mockController := gomock.NewController(suite.T())
	// mockTemplateService := email.NewMockTemplateService(mockController)
	emailTemplateService, err := emailtestconfigs.InitializeEmailTemplateService()
	suite.NoError(err)

	mockEmailService := oddmail.NewMockEmailService(mockController)
	// addressBook := email.AddressBook{
	// 	DefaultSender: "unit-test-execution@mint.cms.gov",
	// }

	emailServiceConfig := &oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(emailServiceConfig).
		AnyTimes()

	// mockTemplateService.EXPECT().GetEmailTemplate(gomock.Any()).MinTimes(1).MaxTimes(1)
	mp := suite.createModelPlan("Test Plan")
	collaborator := suite.createPlanCollaborator(
		mp,
		"MINT",
		[]models.TeamRole{models.TeamRoleModelLead},
	)
	collaboratorAccount, err := suite.testConfigs.Store.UserAccountGetByID(suite.testConfigs.Store, collaborator.UserID)
	suite.NoError(err)

	var analyzedAudits []*models.AnalyzedAudit
	modelNameChange := "Old Name"
	modelStatusChange := []string{"OMB_ASRF_CLEARANCE"}
	documentCount := 2
	crTdlActivity := true
	updatedSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []string{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []string{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []models.AnalyzedModelLeadInfo{{CommonName: "New Lead"}}
	discussionActivity := true

	auditChange := *suite.createAnalyzedAuditChange(modelNameChange, modelStatusChange, documentCount,
		crTdlActivity, updatedSections, reviewSections, clearanceSections, addedLead, discussionActivity)

	analyzedAudit := suite.createAnalyzedAudit(mp, time.Now().UTC(), auditChange)

	// Test getDailyDigestAnalyzedAudits

	analyzedAudits, _, err = GetDigestAnalyzedAudits(collaborator.UserID, time.Now().UTC(), suite.testConfigs.Store, suite.testConfigs.Logger)
	suite.Equal(analyzedAudit.ID, analyzedAudits[0].ID)
	suite.NoError(err)

	// Test generateDailyDigestEmail email to check content
	humanized := analyzedAudits[0].Changes.HumanizedSubset(5)
	emailSubject, emailBody, err := GenerateDigestEmail(analyzedAudits, emailTemplateService, mockEmailService)
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

	// TODO: EASI-(EASI-3949) //Either get the mock template service working, or make another template service.
	// mockTemplateService.EXPECT().GetEmailTemplate(gomock.Any()).MinTimes(1).MaxTimes(1)

	//TODO: EASI-(EASI-3949) add this to the digest email job test test, leave out of this test
	// err = worker.DigestEmailJob(context.Background(), time.Now().UTC().Format("2006-01-02"), collaborator.UserID.String()) // pass user id as string because that is how it is returned from Faktory

	suite.NoError(err)
	mockController.Finish()
}
