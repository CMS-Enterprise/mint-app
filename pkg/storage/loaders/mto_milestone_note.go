package loaders

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader/v7"
)

type mtoMilestoneNoteLoaders struct {
	ByMilestoneID LoaderWrapper[uuid.UUID, []*models.MTOMilestoneNote]
}

var MTOMilestoneNote = &mtoMilestoneNoteLoaders{
	ByMilestoneID: NewLoaderWrapper(batchMTOMilestoneNoteGetByMilestoneID),
}

func batchMTOMilestoneNoteGetByMilestoneID(ctx context.Context, milestoneIDs []uuid.UUID) []*dataloader.Result[[]*models.MTOMilestoneNote] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOMilestoneNote](milestoneIDs, err)
	}
	data, err := storage.MTOMilestoneNoteGetByMilestoneIDLoader(loaders.DataReader.Store, logger, milestoneIDs)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOMilestoneNote](milestoneIDs, err)
	}
	getKeyFunc := func(data *models.MTOMilestoneNote) uuid.UUID {
		return data.MTOMilestoneID
	}
	return oneToManyDataLoader(milestoneIDs, data, getKeyFunc)
}
