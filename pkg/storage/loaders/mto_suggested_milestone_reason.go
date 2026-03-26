package loaders

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/graph-gophers/dataloader/v7"
)

// mtoSuggestedMilestoneReasonLoaders holds LoaderWrappers related to MTO Suggested Milestone Reasons
type mtoSuggestedMilestoneReasonLoaders struct {
	// ByMTOSuggestedMilestoneID returns all reasons for a given mto_suggested_milestone ID
	ByMTOSuggestedMilestoneID LoaderWrapper[uuid.UUID, []*models.MTOSuggestedMilestoneReason]
}

// MTOSuggestedMilestoneReason is the singleton instance of all LoaderWrappers related to
// MTO Suggested Milestone Reasons
var MTOSuggestedMilestoneReason = &mtoSuggestedMilestoneReasonLoaders{
	ByMTOSuggestedMilestoneID: NewLoaderWrapper(batchMTOSuggestedMilestoneReasonGetByMTOSuggestedMilestoneID),
}

// batchMTOSuggestedMilestoneReasonGetByMTOSuggestedMilestoneID returns reasons for a batch
// of mto_suggested_milestone IDs
func batchMTOSuggestedMilestoneReasonGetByMTOSuggestedMilestoneID(
	ctx context.Context,
	suggestedMilestoneIDs []uuid.UUID,
) []*dataloader.Result[[]*models.MTOSuggestedMilestoneReason] {
	loaders, err := Loaders(ctx)
	logger := appcontext.ZLogger(ctx)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSuggestedMilestoneReason](suggestedMilestoneIDs, err)
	}

	data, err := storage.MTOSuggestedMilestoneReasonGetByMTOSuggestedMilestoneIDLoader(
		loaders.DataReader.Store,
		logger,
		suggestedMilestoneIDs,
	)
	if err != nil {
		return errorPerEachKey[uuid.UUID, []*models.MTOSuggestedMilestoneReason](suggestedMilestoneIDs, err)
	}

	getKeyFunc := func(reason *models.MTOSuggestedMilestoneReason) uuid.UUID {
		return reason.MTOSuggestedMilestoneID
	}

	return oneToManyDataLoader(suggestedMilestoneIDs, data, getKeyFunc)
}
