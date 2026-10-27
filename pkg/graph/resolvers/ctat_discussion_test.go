package resolvers

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

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
	created, err := createDiscussion(ctx, suite.testConfigs.Store, model.CTATDiscussionInput{
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

	created, err := createDiscussion(ctx, suite.testConfigs.Store, model.CTATDiscussionInput{
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
	posted, err := createDiscussion(requesterCtx, suite.testConfigs.Store, model.CTATDiscussionInput{
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

	created, err := createDiscussion(ctx, suite.testConfigs.Store, model.CTATDiscussionInput{
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

	created, err := createDiscussion(ctx, suite.testConfigs.Store, input)
	suite.ErrorContains(err, "not found")
	suite.Nil(created)

	created, err = createDiscussion(suite.testConfigs.Context, suite.testConfigs.Store, input)
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

	first, err := createDiscussion(ctx, suite.testConfigs.Store, model.CTATDiscussionInput{
		TicketID: ticketA.ID, Content: "First post",
	})
	suite.Require().NoError(err)
	second, err := createDiscussion(ctx, suite.testConfigs.Store, model.CTATDiscussionInput{
		TicketID: ticketA.ID, Content: "Second post",
	})
	suite.Require().NoError(err)
	onOtherTicket, err := createDiscussion(ctx, suite.testConfigs.Store, model.CTATDiscussionInput{
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
