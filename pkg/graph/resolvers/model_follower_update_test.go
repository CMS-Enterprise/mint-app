package resolvers

import (
	"github.com/golang/mock/gomock"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

const modelFollowerUpdateTestContent = "<p>The <strong>model</strong> has an <u>update</u></p>"

func (suite *ResolverSuite) followModelPlan(plan *models.ModelPlan, userName string) *authentication.ApplicationPrincipal {
	princ := suite.getTestPrincipal(suite.testConfigs.Store, userName)
	_, err := PlanFavoriteCreate(suite.testConfigs.Store, suite.testConfigs.Logger, princ, princ.Account().ID, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	return princ
}

func (suite *ResolverSuite) followerUpdateNotifications(princ *authentication.ApplicationPrincipal) []*models.UserNotification {
	nots, err := notifications.UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, princ)
	suite.NoError(err)
	var followerUpdates []*models.UserNotification
	for _, notif := range nots.Notifications {
		activity, actErr := loaders.ActivityGetByID(suite.testConfigs.Context, notif.ActivityID)
		suite.NoError(actErr)
		if activity.ActivityType == models.ActivityModelFollowerUpdate {
			followerUpdates = append(followerUpdates, notif)
		}
	}
	return followerUpdates
}

func (suite *ResolverSuite) TestModelFollowerUpdateSend() {
	plan := suite.createModelPlan("Plan with an update")
	emailFollower := suite.followModelPlan(plan, "FOLA")
	inAppFollower := suite.followModelPlan(plan, "FOLB")

	_, err := UserNotificationPreferencesUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		inAppFollower,
		suite.testConfigs.Store,
		map[string]interface{}{"modelFollowerUpdate": models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp}},
	)
	suite.NoError(err)

	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	addressBook := email.AddressBook{DefaultSender: "unit-test-execution@mint.cms.gov"}

	mockEmailService.EXPECT().GetConfig().Return(&oddmail.GoSimpleMailServiceConfig{ClientAddress: "http://localhost:3005"}).AnyTimes()

	var sentOptions oddmail.EmailOptions
	var sentBody string
	mockEmailService.
		EXPECT().
		Send(
			gomock.Eq(addressBook.DefaultSender),
			gomock.Eq([]string{}),
			gomock.Nil(),
			gomock.Eq("A model has shared a message"),
			gomock.Eq("text/html"),
			gomock.Any(),
			gomock.Any(),
		).
		DoAndReturn(func(_ string, _ []string, _ []string, _ string, _ string, body string, opts ...oddmail.EmailOption) error {
			sentBody = body
			for _, opt := range opts {
				opt(&sentOptions)
			}
			return nil
		}).
		Times(1)

	followerUpdate, err := ModelFollowerUpdateSend(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		mockEmailService,
		addressBook,
		plan.ID,
		modelFollowerUpdateTestContent+`<script>alert("x")</script>`,
	)
	suite.NoError(err)
	if suite.NotNil(followerUpdate) {
		suite.Equal(plan.ID, followerUpdate.ModelPlanID)
		suite.Equal(suite.testConfigs.Principal.Account().ID, followerUpdate.CreatedBy)
		suite.Equal(modelFollowerUpdateTestContent, followerUpdate.Content)
	}

	// Only followers who keep email turned on are BCC'd, and the sender never is
	suite.EqualValues([]string{emailFollower.Account().Email}, sentOptions.BccAddresses)
	suite.Contains(sentBody, modelFollowerUpdateTestContent)
	suite.NotContains(sentBody, "<script>")

	emailFollowerNots := suite.followerUpdateNotifications(emailFollower)
	if suite.Len(emailFollowerNots, 1) {
		suite.True(emailFollowerNots[0].InAppSent)
		suite.True(emailFollowerNots[0].EmailSent)
	}

	inAppFollowerNots := suite.followerUpdateNotifications(inAppFollower)
	if suite.Len(inAppFollowerNots, 1) {
		suite.True(inAppFollowerNots[0].InAppSent)
		suite.False(inAppFollowerNots[0].EmailSent)
	}

	// The plan creator follows the plan automatically, but does not get notified of their own message
	suite.Empty(suite.followerUpdateNotifications(suite.testConfigs.Principal))
}

func (suite *ResolverSuite) TestModelFollowerUpdateSendNoEmailRecipients() {
	plan := suite.createModelPlan("Plan with only the sender following")

	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailService.EXPECT().Send(gomock.Any(), gomock.Any(), gomock.Any(), gomock.Any(), gomock.Any(), gomock.Any(), gomock.Any()).Times(0)

	followerUpdate, err := ModelFollowerUpdateSend(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		mockEmailService,
		email.AddressBook{},
		plan.ID,
		modelFollowerUpdateTestContent,
	)
	suite.NoError(err)
	suite.NotNil(followerUpdate)
	suite.Empty(suite.followerUpdateNotifications(suite.testConfigs.Principal))
}

func (suite *ResolverSuite) TestModelFollowerUpdateSendEmptyContent() {
	plan := suite.createModelPlan("Plan with an empty update")
	follower := suite.followModelPlan(plan, "FOLC")

	for _, content := range []string{"", "<p></p>", "<p>   </p>", "<script>alert('x')</script>", "<p>&nbsp;</p>"} {
		followerUpdate, err := ModelFollowerUpdateSend(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Store,
			suite.testConfigs.Principal,
			nil,
			email.AddressBook{},
			plan.ID,
			content,
		)
		suite.Error(err, "content %q should be rejected", content)
		suite.Nil(followerUpdate)
	}

	suite.Empty(suite.followerUpdateNotifications(follower))

	for _, translatedAudit := range suite.dangerousQueueAndTranslateAllAudits() {
		suite.NotEqual(models.TNModelFollowerUpdate, translatedAudit.TableName, "rejected messages should not be saved")
	}
}
