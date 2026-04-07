package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCommonMilestoneGetByModelPlanIDLOADER implements resolver logic to get all MTO common milestones by a model plan ID using a data loader
// The modelPlanID is optional. It is used to provide meta data about the CommonMilestone in relation to a model plan (was it added or recommended?)
func MTOCommonMilestoneGetByModelPlanIDLOADER(ctx context.Context, modelPlanID *uuid.UUID) ([]*models.MTOCommonMilestone, error) {

	// Translate a nil key to UUID nil, as we need a primitive type for translating results later
	var key uuid.UUID
	if modelPlanID != nil {
		key = *modelPlanID
	}
	return loaders.MTOCommonMilestone.ByModelPlanID.Load(ctx, key)
}

// MTOCommonMilestoneGetByIDLOADER returns a common milestone by its ID. Currently, it doesn't provide any contextual data.
func MTOCommonMilestoneGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.MTOCommonMilestone, error) {
	// Future Enhancement look into expanding this to also take contextual model plan data to return is added etc
	return loaders.MTOCommonMilestone.ByID.Load(ctx, id)
}

// MTOSuggestedMilestoneReasonGetByIDLOADER returns all suggestion reasons for a given mto_suggested_milestone ID.
func MTOSuggestedMilestoneReasonGetByIDLOADER(ctx context.Context, id uuid.UUID) ([]*models.MTOSuggestedMilestoneReason, error) {
	return loaders.MTOSuggestedMilestoneReason.ByMTOSuggestedMilestoneID.Load(ctx, id)
}

// ArchiveMTOCommonMilestone marks a common milestone as archived.
func ArchiveMTOCommonMilestone(
	logger *zap.Logger,
	store *storage.Store,
	id uuid.UUID,
	actorUserID uuid.UUID,
) (*models.MTOCommonMilestone, error) {
	return storage.MTOCommonMilestoneArchive(store, logger, id, actorUserID)
}
