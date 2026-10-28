package resolvers

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func createDiscussion(ctx context.Context, np sqlutils.NamedPreparer, input model.CTATDiscussionInput) (*models.CTATDiscussion, error) {
	principalAcct := appcontext.Principal(ctx).Account()
	if principalAcct == nil {
		return nil, errors.New("problem getting principal account when creating discussion")
	}

	// we need to determine if the acting user is the requester
	ctatTicket, err := loaders.CTATRequest.GetByID.Load(ctx, input.TicketID)
	if err != nil {
		return nil, err
	}

	var posterRole models.CTATDiscussionPoster

	switch {
	case ctatTicket.Requester == principalAcct.ID:
		posterRole = models.CTATDiscussionPosterRequester
	case appcontext.Principal(ctx).AllowASSESSMENT():
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

	return storage.CTATDiscussionCreate(np, &discussion)
}

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
