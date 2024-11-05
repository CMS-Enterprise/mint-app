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
	return loaders.MTOCommonMilestone.ByModelPlanID.Load(ctx, modelPlanID)
}
