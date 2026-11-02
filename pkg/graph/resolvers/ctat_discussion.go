package resolvers

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func discussions(ctx context.Context, ticketID uuid.UUID) ([]*models.CTATDiscussion, error) {
	principal := appcontext.Principal(ctx)

	if principal.AllowASSESSMENT() {
		// short-circuit for admins
		return loaders.CTATDiscussion.ByTicketID.Load(ctx, ticketID)
	}

	principalAcct := principal.Account()
	if principalAcct == nil {
		return nil, errors.New("problem getting principal account when getting discussions")
	}

	ctatTicket, err := loaders.CTATRequest.GetByID.Load(ctx, ticketID)
	if err != nil {
		return nil, err
	}

	// check if acting user is requester
	if ctatTicket.Requester != principalAcct.ID {
		return nil, fmt.Errorf("user (%s) is not authorized to view CTAT discussions", principalAcct.Email)
	}

	return loaders.CTATDiscussion.ByTicketID.Load(ctx, ticketID)
}

func createDiscussion(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	input model.CTATDiscussionInput,
) (*models.CTATDiscussion, error) {
	principal := appcontext.Principal(ctx)
	principalAcct := principal.Account()
	if principalAcct == nil {
		return nil, errors.New("problem getting principal account when creating discussion")
	}

	// we need to determine if the acting user is the requester
	ctatTicket, err := loaders.CTATRequest.GetByID.Load(ctx, input.TicketID)
	if err != nil {
		return nil, err
	}

	// disallow discussions on closed tickets
	if ctatTicket.Status == models.CTATStatusClosed {
		return nil, fmt.Errorf("discussion cannot be posted on a closed ticket (%s)", input.TicketID.String())
	}

	var posterRole models.CTATDiscussionPoster

	switch {
	case ctatTicket.Requester == principalAcct.ID:
		posterRole = models.CTATDiscussionPosterRequester
	case principal.AllowASSESSMENT():
		posterRole = models.CTATDiscussionPosterAdmin
	default:
		return nil, fmt.Errorf("user (%s) is not authorized to create a CTAT discussion", principalAcct.Email)
	}

	discussion := models.CTATDiscussion{
		TicketID:   input.TicketID,
		Content:    input.Content,
		PosterRole: posterRole,
		CreatedBy:  principalAcct.ID,
	}

	createdDiscussion, err := storage.CTATDiscussionCreate(np, &discussion)
	if err != nil {
		return nil, err
	}

	// exit here if email service is unavailable
	if emailService == nil {
		return createdDiscussion, nil
	}

	// handle emails
	// if the requester is the one posting the discussion, we do NOT send the requester an email
	// -- we only send an email to the assigned admin and CC the CTAT admin inbox
	//
	// if an admin posts, we send the requester email
	// -- we also send an email ONLY to the CTAT admin inbox

	// create logger prior to go routines to capture `ctx` prior to any http reqs ending
	logger := appcontext.ZLogger(ctx)

	switch posterRole {
	case models.CTATDiscussionPosterRequester:
		// requester posting discussion

		// get admin account
		adminAcct, err := ctatTicket.AssignedAdminUserAccount(ctx)
		if err != nil {
			logger.Error("problem getting admin account for sending CTAT discussion email", zap.Error(err))
			break
		}

		// send email to assigned admin and CC CTAT inbox
		go sendAdminEmail(
			logger,
			emailService,
			addressBook.DefaultSender,
			&adminAcct.Email,
			&addressBook.CTATTeamEmail,
			createdDiscussion,
		)

	case models.CTATDiscussionPosterAdmin:
		// admin posting discussion

		// send requester email
		go sendRequesterEmail(
			logger,
			emailService,
			addressBook.DefaultSender,
			principalAcct.Email,
			createdDiscussion,
		)

		// send email ONLY to CTAT inbox
		go sendAdminEmail(
			logger,
			emailService,
			addressBook.DefaultSender,
			&addressBook.CTATTeamEmail,
			nil,
			createdDiscussion,
		)
	}

	return createdDiscussion, nil
}

func sendRequesterEmail(
	logger *zap.Logger,
	emailService oddmail.EmailService,
	from string,
	requesterEmail string,
	createdDiscussion *models.CTATDiscussion,
	ticket *models.CTATRequest,
) {
	humanReadableID := ticket.HumanReadableID()
	subject, body, err := email.CTAT.DiscussionRequester.GetContent(
		email.CTATDiscussionRequesterSubjectContent{
			TicketNumber: humanReadableID,
		},
		email.CTATDiscussionRequesterBodyContent{
			ClientAddress: emailService.GetConfig().GetClientAddress(),
			CTATTicketID:  ticket.ID.String(),
			TicketNumber:  humanReadableID,
			PosterName:    "",
			PosterRole:    createdDiscussion.PosterRole.String(),
		},
	)
}

func sendAdminEmail(
	logger *zap.Logger,
	emailService oddmail.EmailService,
	from string,
	to *string,
	cc *string,
	createdDiscussion *models.CTATDiscussion,
	ticket *models.CTATRequest,
) {
}
