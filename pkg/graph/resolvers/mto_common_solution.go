package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCommonSolutionGetByModelPlanIDLOADER implements resolver logic to get all MTO common Solutions by a model plan ID using a data loader
// The modelPlanID is optional. It is used to provide meta data about the CommonSolution in relation to a model plan (was it added or recommended?)
func MTOCommonSolutionGetByModelPlanIDLOADER(ctx context.Context, modelPlanID *uuid.UUID) ([]*models.MTOCommonSolution, error) {

	// Translate a nil key to UUID nil, as we need a primitive type for translating results later
	var key uuid.UUID
	if modelPlanID != nil {
		key = *modelPlanID
	}
	return loaders.MTOCommonSolution.ByModelPlanID.Load(ctx, key)
}

// MTOCommonSolutionGetByKeyLOADER returns a common Solution by it's key. Currently, it doesn't provide any contextual data.
func MTOCommonSolutionGetByKeyLOADER(ctx context.Context, key models.MTOCommonSolutionKey) (*models.MTOCommonSolution, error) {
	// TODO look into expanding this to also take contextual model plan data to return is added etc
	return loaders.MTOCommonSolution.ByKey.Load(ctx, key)
}

// MTOCommonSolutionGetByCommonMilestoneKeyLOADER returns all common Solutions associated with a common Milestone by it's key. Currently, it doesn't provide any contextual data.
func MTOCommonSolutionGetByCommonMilestoneKeyLOADER(ctx context.Context, key models.MTOCommonMilestoneKey) ([]*models.MTOCommonSolution, error) {
	// TODO look into expanding this to also take contextual model plan data to return is added etc
	return loaders.MTOCommonSolution.ByCommonMilestoneKey.Load(ctx, key)
}
