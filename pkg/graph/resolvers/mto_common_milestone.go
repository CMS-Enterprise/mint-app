package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
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

// MTOCommonMilestoneGetByKeyLOADER returns a common milestone by it's key. Currently, it doesn't provide any contextual data.
func MTOCommonMilestoneGetByKeyLOADER(ctx context.Context, key models.MTOCommonMilestoneKey) (*models.MTOCommonMilestone, error) {
	// TODO look into expanding this to also take contextual model plan data to return is added etc
	return loaders.MTOCommonMilestone.ByKey.Load(ctx, key)
}
