package resolvers

import (
	"context"
	"strings"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/notifications"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
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
	collaboratorAccount, err := storage.UserAccountGetByID(suite.testConfigs.Store, collaborator.UserID)
	suite.NoError(err)

	var analyzedAudits []*models.AnalyzedAudit

	analyzedAudit := suite.createDefaultTestAnalyzedAudit(mp, time.Now().UTC())

	// Test getDailyDigestAnalyzedAudits

	analyzedAudits, _, err = getDigestAnalyzedAudits(suite.testConfigs.Store, collaborator.UserID, time.Now().UTC(), suite.testConfigs.Logger)
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

	userName := "DUDE"

	mp := suite.createModelPlan("Test Plan")

	userAccount := suite.getTestPrincipal(suite.testConfigs.Store, userName)

	// Create a favorite, as favorites determine what models users get a digest in regards to.
	_, err = PlanFavoriteCreate(suite.testConfigs.Store, suite.testConfigs.Logger, userAccount, userAccount.Account().ID, suite.testConfigs.Store, mp.ID)
	suite.NoError(err)

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

	preferenceFunctions := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		return storage.UserNotificationPreferencesGetByUserID(suite.testConfigs.Store, user_id)
	}

	emailErr := DailyDigestNotificationSend(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, today, userAccount.Account().ID, preferenceFunctions, mockEmailService, emailTemplateService, addressBook)
	suite.NoError(emailErr)

	notificationCollection, err := notifications.UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, userAccount)
	suite.NoError(err)
	// There is more than one notification
	suite.Len(notificationCollection.Notifications, 1)

	retNot := notificationCollection.Notifications[0]

	activity, err := loaders.ActivityGetByID(suite.testConfigs.Context, retNot.ActivityID)
	suite.NoError(err)
	suite.NotNil(activity)
	suite.EqualValues(retNot.ActivityID, activity.ID)
	suite.EqualValues(models.ActivityDigest, activity.ActivityType)

	// Assert the data of the meta data
	digestData, isDigest := activity.MetaData.(*models.DailyDigestCompleteActivityMeta)
	suite.True(isDigest)

	suite.EqualValues([]uuid.UUID{mp.ID}, digestData.ModelPlanIDs)
	suite.EqualValues(models.ActivityDigest, digestData.Type)
	suite.EqualValues(userAccount.Account().ID, digestData.UserID)
	suite.EqualValues(0, digestData.Version)
	suite.EqualValues(today.Month(), digestData.Date.Month())
	suite.EqualValues(today.Year(), digestData.Date.Year())
	suite.EqualValues(today.Day(), digestData.Date.Day())

}
