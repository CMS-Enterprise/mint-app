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

	if ctatTicket == nil {
		return nil, fmt.Errorf("ctatTicket not found with id %s", input.TicketID.String())
	}

	var posterRole models.CTATDiscussionPoster
	if ctatTicket.Requester == principalAcct.ID {
		// this is the requester making a discussion
		posterRole = models.CTATDiscussionPosterRequester
	} else {
		// otherwise, it's an admin
		posterRole = models.CTATDiscussionPosterAdmin
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
	return loaders.CTATDiscussion.ByTicketID.Load(ctx, ticketID)
}
