package resolvers

import (
	"time"

	"github.com/golang/mock/gomock"
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

type ctatDiscussionTestEmail struct {
	to      string
	cc      string
	subject string
	body    string
}

func recordCTATDiscussionTestEmail(sent chan<- ctatDiscussionTestEmail) func(string, *string, *string, string, string, string, ...oddmail.EmailOption) error {
	return func(_ string, to, cc *string, subject, _ string, body string, _ ...oddmail.EmailOption) error {
		email := ctatDiscussionTestEmail{subject: subject, body: body}
		if to != nil {
			email.to = *to
		}
		if cc != nil {
			email.cc = *cc
		}
		sent <- email
		return nil
	}
}

func (suite *ResolverSuite) waitForCTATDiscussionTestEmails(sent <-chan ctatDiscussionTestEmail, count int) []ctatDiscussionTestEmail {
	suite.T().Helper()
	emails := make([]ctatDiscussionTestEmail, 0, count)
	for range count {
		select {
		case email := <-sent:
			emails = append(emails, email)
		case <-time.After(2 * time.Second):
			suite.FailNow("timed out waiting for CTAT discussion email")
		}
	}
	return emails
}

func (suite *ResolverSuite) TestCreateCTATDiscussionAsRequester() {
	requester := suite.testConfigs.Principal
	ticket := suite.createTestCTATRequest(
		requester.Account().ID,
		time.Now().Add(24*time.Hour),
		"Requester discussion",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	// The suite principal also has assessment access; ticket ownership takes precedence.
	suite.True(requester.AllowASSESSMENT())
	ctx := appcontext.WithPrincipal(suite.testConfigs.Context, requester)

	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	addressBook := email.AddressBook{
		DefaultSender: "unit-test-execution@mint.cms.gov",
		CTATTeamEmail: "test.ctat.team@mint.dev.cms.gov",
	}
	mockEmailService.EXPECT().GetConfig().Return(&oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}).Times(1)
	sent := make(chan ctatDiscussionTestEmail, 1)
	mockEmailService.EXPECT().Send(
		addressBook.DefaultSender,
		&addressBook.CTATTeamEmail,
		gomock.Nil(),
		gomock.Any(),
		"text/html",
		gomock.Any(),
	).DoAndReturn(recordCTATDiscussionTestEmail(sent)).Times(1)

	created, err := createDiscussion(ctx, suite.testConfigs.Store, mockEmailService, addressBook, model.CTATDiscussionInput{
		TicketID: ticket.ID,
		Content:  "I have a question about this ticket.",
	})
	suite.Require().NoError(err)
	suite.Require().NotNil(created)
	suite.NotEqual(uuid.Nil, created.ID)
	suite.Equal(ticket.ID, created.TicketID)
	suite.Equal("I have a question about this ticket.", created.Content)
	suite.Equal(models.CTATDiscussionPosterRequester, created.PosterRole)
	suite.Equal(requester.Account().ID, created.CreatedBy)
	suite.False(created.CreatedDts.IsZero())

	emails := suite.waitForCTATDiscussionTestEmails(sent, 1)
	suite.Equal(addressBook.CTATTeamEmail, emails[0].to)
	suite.Empty(emails[0].cc)
	suite.Contains(emails[0].subject, ticket.HumanReadableID())
	suite.Contains(emails[0].body, created.Content)
	suite.Contains(emails[0].body, requester.Account().CommonName)
	suite.Contains(emails[0].body, created.PosterRole.String())
	suite.Contains(emails[0].body, "have access to the CTAT Admin mailbox")
}

func (suite *ResolverSuite) TestCreateCTATDiscussionEmailsAssignedAdmin() {
	requester := suite.testConfigs.Principal
	ticket := suite.createTestCTATRequest(
		requester.Account().ID,
		time.Now().Add(24*time.Hour),
		"Assigned admin discussion",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	admin := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	adminUsername := "ADMI"
	_, err := CTATRequestAdminUpdate(
		appcontext.WithPrincipal(suite.testConfigs.Context, admin),
		suite.testConfigs.Logger,
		ticket.ID,
		map[string]any{"assignedAdmin": &adminUsername},
		admin,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.Require().NoError(err)

	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	addressBook := email.AddressBook{
		DefaultSender: "unit-test-execution@mint.cms.gov",
		CTATTeamEmail: "test.ctat.team@mint.dev.cms.gov",
	}
	mockEmailService.EXPECT().GetConfig().Return(&oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}).Times(1)
	sent := make(chan ctatDiscussionTestEmail, 1)
	mockEmailService.EXPECT().Send(
		addressBook.DefaultSender,
		&admin.Account().Email,
		&addressBook.CTATTeamEmail,
		gomock.Any(),
		"text/html",
		gomock.Any(),
	).DoAndReturn(recordCTATDiscussionTestEmail(sent)).Times(1)

	created, err := createDiscussion(
		appcontext.WithPrincipal(suite.testConfigs.Context, requester),
		suite.testConfigs.Store,
		mockEmailService,
		addressBook,
		model.CTATDiscussionInput{TicketID: ticket.ID, Content: "Please clarify the requirements."},
	)
	suite.Require().NoError(err)
	suite.Require().NotNil(created)

	emails := suite.waitForCTATDiscussionTestEmails(sent, 1)
	suite.Equal(admin.Account().Email, emails[0].to)
	suite.Equal(addressBook.CTATTeamEmail, emails[0].cc)
	suite.Contains(emails[0].subject, ticket.HumanReadableID())
	suite.Contains(emails[0].body, created.Content)
	suite.Contains(emails[0].body, requester.Account().CommonName)
	suite.Contains(emails[0].body, created.PosterRole.String())
	suite.Contains(emails[0].body, "have access to the CTAT Admin mailbox")
}

func (suite *ResolverSuite) TestCreateCTATDiscussionAsAdmin() {
	requester := suite.testConfigs.Principal
	ticket := suite.createTestCTATRequest(
		requester.Account().ID,
		time.Now().Add(24*time.Hour),
		"Admin discussion",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	admin := suite.getTestPrincipal(suite.testConfigs.Store, "ADMI")
	ctx := appcontext.WithPrincipal(suite.testConfigs.Context, admin)

	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	addressBook := email.AddressBook{
		DefaultSender: "unit-test-execution@mint.cms.gov",
		CTATTeamEmail: "test.ctat.team@mint.dev.cms.gov",
	}
	mockEmailService.EXPECT().GetConfig().Return(&oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}).Times(2)
	sent := make(chan ctatDiscussionTestEmail, 2)
	mockEmailService.EXPECT().Send(
		addressBook.DefaultSender,
		&requester.Account().Email,
		gomock.Nil(),
		gomock.Any(),
		"text/html",
		gomock.Any(),
	).DoAndReturn(recordCTATDiscussionTestEmail(sent)).Times(1)
	mockEmailService.EXPECT().Send(
		addressBook.DefaultSender,
		&addressBook.CTATTeamEmail,
		gomock.Nil(),
		gomock.Any(),
		"text/html",
		gomock.Any(),
	).DoAndReturn(recordCTATDiscussionTestEmail(sent)).Times(1)

	created, err := createDiscussion(ctx, suite.testConfigs.Store, mockEmailService, addressBook, model.CTATDiscussionInput{
		TicketID: ticket.ID,
		Content:  "The CTAT team is reviewing this request.",
	})
	suite.Require().NoError(err)
	suite.Require().NotNil(created)
	suite.Equal(models.CTATDiscussionPosterAdmin, created.PosterRole)
	suite.Equal(admin.Account().ID, created.CreatedBy)

	stored, err := discussions(ctx, ticket.ID)
	suite.Require().NoError(err)
	suite.Require().Len(stored, 1)
	suite.Equal(created.ID, stored[0].ID)
	suite.Equal(models.CTATDiscussionPosterAdmin, stored[0].PosterRole)
	suite.Equal(admin.Account().ID, stored[0].CreatedBy)

	emails := suite.waitForCTATDiscussionTestEmails(sent, 2)
	suite.ElementsMatch([]string{requester.Account().Email, addressBook.CTATTeamEmail}, []string{emails[0].to, emails[1].to})
	for _, sentEmail := range emails {
		suite.Empty(sentEmail.cc)
		suite.Contains(sentEmail.subject, ticket.HumanReadableID())
		suite.Contains(sentEmail.body, created.Content)
		suite.Contains(sentEmail.body, admin.Account().CommonName)
		suite.Contains(sentEmail.body, created.PosterRole.String())
		if sentEmail.to == requester.Account().Email {
			suite.Contains(sentEmail.body, "original submitter of this contract assistance request ticket")
		} else {
			suite.Contains(sentEmail.body, "have access to the CTAT Admin mailbox")
		}
	}
}

func (suite *ResolverSuite) TestCTATDiscussionRejectsNonRequesterWithoutAssessmentAccess() {
	requester := suite.testConfigs.Principal
	ticket := suite.createTestCTATRequest(
		requester.Account().ID,
		time.Now().Add(24*time.Hour),
		"Unauthorized discussion",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	requesterCtx := appcontext.WithPrincipal(suite.testConfigs.Context, requester)

	posted, err := createDiscussion(requesterCtx, suite.testConfigs.Store, nil, email.AddressBook{}, model.CTATDiscussionInput{
		TicketID: ticket.ID,
		Content:  "A private discussion on this ticket.",
	})
	suite.Require().NoError(err)
	suite.Require().NotNil(posted)

	otherUser := suite.getTestPrincipal(suite.testConfigs.Store, "BTAL")
	otherUser.JobCodeASSESSMENT = false
	otherUser.JobCodeUSER = true
	suite.Require().NotEqual(requester.Account().ID, otherUser.Account().ID)
	ctx := appcontext.WithPrincipal(suite.testConfigs.Context, otherUser)

	created, err := createDiscussion(ctx, suite.testConfigs.Store, nil, email.AddressBook{}, model.CTATDiscussionInput{
		TicketID: ticket.ID,
		Content:  "I should not be able to post on this ticket.",
	})
	suite.ErrorContains(err, "is not authorized to create a CTAT discussion")
	suite.Nil(created)

	stored, err := discussions(ctx, ticket.ID)
	suite.ErrorContains(err, "is not authorized to view CTAT discussions")
	suite.Nil(stored)
}

func (suite *ResolverSuite) TestCreateCTATDiscussionRequiresExistingTicketAndPrincipal() {
	input := model.CTATDiscussionInput{TicketID: uuid.New(), Content: "No ticket"}
	ctx := appcontext.WithPrincipal(suite.testConfigs.Context, suite.testConfigs.Principal)

	created, err := createDiscussion(ctx, suite.testConfigs.Store, nil, email.AddressBook{}, input)
	suite.ErrorContains(err, "not found")
	suite.Nil(created)

	created, err = createDiscussion(suite.testConfigs.Context, suite.testConfigs.Store, nil, email.AddressBook{}, input)
	suite.ErrorContains(err, "problem getting principal account")
	suite.Nil(created)
}

func (suite *ResolverSuite) TestCTATDiscussionsByTicket() {
	requester := suite.testConfigs.Principal
	ticketA := suite.createTestCTATRequest(
		requester.Account().ID,
		time.Now().Add(24*time.Hour),
		"First discussion ticket",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)
	ticketB := suite.createTestCTATRequest(
		requester.Account().ID,
		time.Now().Add(48*time.Hour),
		"Second discussion ticket",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ},
		models.CTATStatusNew,
	)
	emptyTicket := suite.createTestCTATRequest(
		requester.Account().ID,
		time.Now().Add(72*time.Hour),
		"Empty discussion ticket",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP},
		models.CTATStatusNew,
	)
	ctx := appcontext.WithPrincipal(suite.testConfigs.Context, requester)

	first, err := createDiscussion(ctx, suite.testConfigs.Store, nil, email.AddressBook{}, model.CTATDiscussionInput{
		TicketID: ticketA.ID, Content: "First post",
	})
	suite.Require().NoError(err)
	second, err := createDiscussion(ctx, suite.testConfigs.Store, nil, email.AddressBook{}, model.CTATDiscussionInput{
		TicketID: ticketA.ID, Content: "Second post",
	})
	suite.Require().NoError(err)
	onOtherTicket, err := createDiscussion(ctx, suite.testConfigs.Store, nil, email.AddressBook{}, model.CTATDiscussionInput{
		TicketID: ticketB.ID, Content: "Other ticket post",
	})
	suite.Require().NoError(err)

	posts, err := discussions(ctx, ticketA.ID)
	suite.Require().NoError(err)
	suite.Require().Len(posts, 2)
	suite.Equal(second.ID, posts[0].ID)
	suite.Equal(first.ID, posts[1].ID)

	otherPosts, err := discussions(ctx, ticketB.ID)
	suite.Require().NoError(err)
	suite.Require().Len(otherPosts, 1)
	suite.Equal(onOtherTicket.ID, otherPosts[0].ID)

	emptyPosts, err := discussions(ctx, emptyTicket.ID)
	suite.NoError(err)
	suite.Empty(emptyPosts)
}
