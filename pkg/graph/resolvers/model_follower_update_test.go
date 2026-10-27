package resolvers

import (
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

const modelFollowerUpdateTestSender = "unit-test-execution@mint.cms.gov"

type sentModelFollowerUpdateEmail struct {
	subject string
	body    string
	bcc     []string
}

// followModelPlan makes the given principal follow the model plan
func (suite *ResolverSuite) followModelPlan(plan *models.ModelPlan, principal authentication.Principal) {
	_, err := PlanFavoriteCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		principal,
		principal.Account().ID,
		suite.testConfigs.Store,
		plan.ID,
	)
	suite.NoError(err)
}

// expectModelFollowerUpdateEmail mocks the email service to expect one email, returning sendErr from the send.
// The returned function waits for the email to be sent and returns it.
func (suite *ResolverSuite) expectModelFollowerUpdateEmail(sendErr error) (*oddmail.MockEmailService, func() sentModelFollowerUpdateEmail) {
	mockController := gomock.NewController(suite.T())
	suite.T().Cleanup(mockController.Finish)
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailService.EXPECT().GetConfig().Return(&oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}).AnyTimes()

	var (
		mu   sync.Mutex
		sent sentModelFollowerUpdateEmail
	)
	sentCh := make(chan struct{})
	mockEmailService.EXPECT().
		Send(
			gomock.Eq(modelFollowerUpdateTestSender),
			gomock.Nil(),
			gomock.Nil(),
			gomock.Any(),
			gomock.Eq("text/html"),
			gomock.Any(),
			gomock.Any(),
		).
		DoAndReturn(func(_ string, _, _ *string, subject, _ string, body string, opts ...oddmail.EmailOption) error {
			var emailOptions oddmail.EmailOptions
			for _, opt := range opts {
				opt(&emailOptions)
			}

			mu.Lock()
			sent = sentModelFollowerUpdateEmail{subject: subject, body: body, bcc: emailOptions.BccAddresses}
			mu.Unlock()
			close(sentCh)
			return sendErr
		}).
		Times(1)

	wait := func() sentModelFollowerUpdateEmail {
		select {
		case <-sentCh:
		case <-time.After(2 * time.Second):
			suite.FailNow("timed out waiting for the model follower update email to send")
		}
		mu.Lock()
		defer mu.Unlock()
		return sent
	}

	return mockEmailService, wait
}

func (suite *ResolverSuite) TestModelFollowerUpdateSendSanitizesContent() {
	plan := suite.createModelPlan("Plan For Follower Update Sanitization")

	update, err := ModelFollowerUpdateSend(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		plan.ID,
		`<p onclick="alert(1)">Hello <strong>team</strong></p><script>alert('xss')</script>`,
	)
	suite.NoError(err)
	suite.NotNil(update)

	suite.Equal("<p>Hello <strong>team</strong></p>", update.Content)
	suite.Equal(plan.ID, update.ModelPlanID)
	suite.Equal(suite.testConfigs.Principal.Account().ID, update.CreatedBy)
	suite.Equal(suite.testConfigs.Principal.Account().ID, update.CreatedByUserAccount.ID)
	suite.False(update.CreatedDts.IsZero())
}

func (suite *ResolverSuite) TestModelFollowerUpdateSendRejectsEmptyContent() {
	plan := suite.createModelPlan("Plan For Follower Update Empty Content")

	for _, content := range []string{"", "   ", "<p></p>", "<script>alert('xss')</script>", "<p> <br> </p>"} {
		update, err := ModelFollowerUpdateSend(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			email.AddressBook{},
			plan.ID,
			content,
		)
		suite.Error(err, "content %q should be rejected", content)
		suite.Nil(update)
	}
}

func (suite *ResolverSuite) TestModelFollowerUpdateSendRejectsNonCollaborator() {
	plan := suite.createModelPlan("Plan For Follower Update Non Collaborator")
	nonCollaborator := suite.getTestPrincipal(suite.testConfigs.Store, "NFUC")
	nonCollaborator.JobCodeASSESSMENT = false // assessment team members are treated as collaborators on every model
	suite.followModelPlan(plan, nonCollaborator)

	update, err := ModelFollowerUpdateSend(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nonCollaborator,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		plan.ID,
		"<p>Hello</p>",
	)
	suite.Error(err)
	suite.Nil(update)

	followerNots, err := notifications.UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, nonCollaborator)
	suite.NoError(err)
	suite.EqualValues(0, followerNots.NumUnreadNotifications())
}

func (suite *ResolverSuite) TestModelFollowerUpdateSendNotifiesFollowers() {
	plan := suite.createModelPlan("Plan For Follower Update Notifications")
	suite.createPlanCollaborator(plan, "MFUC", []models.TeamRole{models.TeamRoleLeadership})
	collaboratorPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "MFUC")

	followerOne := suite.getTestPrincipal(suite.testConfigs.Store, "MFU1")
	followerTwo := suite.getTestPrincipal(suite.testConfigs.Store, "MFU2")
	notFollower := suite.getTestPrincipal(suite.testConfigs.Store, "MFU3")
	suite.followModelPlan(plan, followerOne)
	suite.followModelPlan(plan, followerTwo)

	// a follower of a different model should not be notified
	otherPlan := suite.createModelPlan("Other Plan For Follower Update Notifications")
	suite.followModelPlan(otherPlan, notFollower)

	mockEmailService, waitForEmail := suite.expectModelFollowerUpdateEmail(nil)

	update, err := ModelFollowerUpdateSend(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		collaboratorPrincipal,
		suite.testConfigs.Store,
		mockEmailService,
		email.AddressBook{DefaultSender: modelFollowerUpdateTestSender},
		plan.ID,
		`<p>Big news <a href="https://example.com">here</a></p><script>alert('xss')</script>`,
	)
	suite.NoError(err)
	suite.NotNil(update)

	// the model team is automatically following the model, and the sender is not excluded from the update
	expectedRecipients := []authentication.Principal{suite.testConfigs.Principal, collaboratorPrincipal, followerOne, followerTwo}
	for _, follower := range expectedRecipients {
		nots, err := notifications.UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, follower)
		suite.NoError(err)
		// recipients can have other notifications, like being added as a collaborator
		updateNots := lo.Filter(nots.Notifications, func(n *models.UserNotification, _ int) bool {
			return n.ActivityID == update.ID
		})
		suite.Len(updateNots, 1)
		suite.False(updateNots[0].IsRead)
	}

	notFollowerNots, err := notifications.UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, notFollower)
	suite.NoError(err)
	suite.EqualValues(0, notFollowerNots.NumUnreadNotifications())

	sent := waitForEmail()
	suite.ElementsMatch(
		lo.Map(expectedRecipients, func(recipient authentication.Principal, _ int) string { return recipient.Account().Email }),
		sent.bcc,
	)
	// the test plan has no abbreviation, so the subject falls back to the model name
	suite.Equal(fmt.Sprintf("A model (%s) has shared a message", plan.ModelName), sent.subject)
	suite.Contains(sent.body, "Model lead(s)")
	suite.Contains(sent.body, "Big news")
	suite.Contains(sent.body, `href="https://example.com"`)
	suite.NotContains(sent.body, "<script>")
	suite.NotContains(sent.body, "alert(")
}

func (suite *ResolverSuite) TestModelFollowerUpdateSendWithNoFollowers() {
	plan := suite.createModelPlan("Plan For Follower Update No Followers")
	// the creator automatically follows the model
	_, err := PlanFavoriteDelete(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)

	// the email service has no expectations, so any attempt to send an email fails the test
	mockController := gomock.NewController(suite.T())
	defer mockController.Finish()
	mockEmailService := oddmail.NewMockEmailService(mockController)

	update, err := ModelFollowerUpdateSend(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		mockEmailService,
		email.AddressBook{DefaultSender: modelFollowerUpdateTestSender},
		plan.ID,
		"<p>Hello</p>",
	)
	suite.NoError(err)
	suite.NotNil(update)
	suite.Equal("<p>Hello</p>", update.Content)
}

func (suite *ResolverSuite) TestModelFollowerUpdateSendEmailFailureDoesNotFailMutation() {
	plan := suite.createModelPlan("Plan For Follower Update Email Failure")
	follower := suite.getTestPrincipal(suite.testConfigs.Store, "MFUE")
	suite.followModelPlan(plan, follower)

	mockEmailService, waitForEmail := suite.expectModelFollowerUpdateEmail(errors.New("smtp is down"))

	update, err := ModelFollowerUpdateSend(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		mockEmailService,
		email.AddressBook{DefaultSender: modelFollowerUpdateTestSender},
		plan.ID,
		"<p>Hello</p>",
	)
	suite.NoError(err)
	suite.NotNil(update)

	waitForEmail()

	nots, err := notifications.UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, follower)
	suite.NoError(err)
	suite.EqualValues(1, nots.NumUnreadNotifications())
}
