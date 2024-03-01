package resolvers

import (
	"strings"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/testconfig/emailtestconfigs"
)

func (suite *ResolverSuite) TestDailyDigestNotificationSendComponents() {

	mockController := gomock.NewController(suite.T())

	// If desired we can use a mock template service in the future
	// mockTemplateService := email.NewMockTemplateService(mockController)
	emailTemplateService, err := emailtestconfigs.InitializeEmailTemplateService()
	suite.NoError(err)

	mockEmailService := emailtestconfigs.InitializeMockEmailService(mockController)

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(&emailtestconfigs.TestEmailServiceConfig).
		AnyTimes()

	// 	testTemplate  := *emailTemplates.EmailTemplate{}
	// mockTemplateService.EXPECT().GetEmailTemplate(gomock.Eq(email.DailyDigestTemplateName)).Return(testTemplate,nil).MinTimes(1).MaxTimes(1)

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

	analyzedAudits, _, err = getDigestAnalyzedAudits(collaborator.UserID, time.Now().UTC(), suite.testConfigs.Store, suite.testConfigs.Logger)
	suite.Equal(analyzedAudit.ID, analyzedAudits[0].ID)
	suite.NoError(err)

	// Test generateDailyDigestEmail email to check content
	humanized := analyzedAudits[0].Changes.HumanizedSubset(5)
	emailSubject, emailBody, err := generateDigestEmail(analyzedAudits, emailTemplateService, mockEmailService)
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

	suite.NoError(err)
	mockController.Finish()
}

// TestDailyDigestNotificationSend verifies that TestDailyDigestNotificationSend functions as expected, and does not generate an error
func (suite *ResolverSuite) TestDailyDigestNotificationSend() {

	mockController := gomock.NewController(suite.T())
	addressBook := emailtestconfigs.InitializeAddressBook()
	today := time.Now()

	// If desired we can use a mock template service in the future
	// mockTemplateService := email.NewMockTemplateService(mockController)
	emailTemplateService, err := emailtestconfigs.InitializeEmailTemplateService()
	suite.NoError(err)

	mockEmailService := emailtestconfigs.InitializeMockEmailService(mockController)

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(&emailtestconfigs.TestEmailServiceConfig).
		AnyTimes()

	timeNow := time.Now()
	userName := "DUDE"

	mp := suite.createModelPlan("Test Plan")
	_ = suite.createPlanCollaborator(
		mp,
		userName,
		[]models.TeamRole{models.TeamRoleModelLead},
	)
	userAccount := getTestPrincipal(suite.testConfigs.Store, userName)

	// Generate Audits for the model so the
	_, err2 := AnalyzeModelPlanForAnalyzedAudit(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, today, mp.ID)
	suite.NoError(err2)

	mockEmailService.
		EXPECT().
		Send(
			addressBook.DefaultSender,
			gomock.Eq([]string{userAccount.Account().Email}),
			gomock.Any(),
			gomock.Any(),
			gomock.Any(),
			gomock.Any(),
		).MinTimes(1).MaxTimes(1)
	emailErr := DailyDigestNotificationSend(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, timeNow, userAccount.Account().ID, mockEmailService, emailTemplateService, addressBook)
	suite.NoError(emailErr)

}
