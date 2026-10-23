package loaders

import (
	"context"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

type ctatDiscussionLoaders struct {
	ByTicketID LoaderWrapper[uuid.UUID, []*models.CTATDiscussion]
}

var CTATDiscussion = &ctatDiscussionLoaders{
	ByTicketID: NewLoaderWrapper(batchCTATDiscussionsByTicketID),
}

func batchCTATDiscussionsByTicketID(ctx context.Context, ticketIDs []uuid.UUID) []*dataloader.Result[[]*models.CTATDiscussion] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATDiscussion](ticketIDs, err)
	}

	data, err := storage.CTATDiscussionByTicketID(loaders.DataReader.Store, ticketIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.CTATDiscussion](ticketIDs, err)
	}

	getKeyFunc := func(discussion *models.CTATDiscussion) uuid.UUID {
		return discussion.TicketID
	}

	return oneToManyDataLoader(ticketIDs, data, getKeyFunc)
}
