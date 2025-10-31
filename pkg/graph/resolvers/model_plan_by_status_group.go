package resolvers

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// ModelPlansByStatusLOADER implements resolver logic to get model plans by status using a data loader
func ModelPlansByStatusLOADER(ctx context.Context, statusGroup models.ModelPlanStatusGroup) ([]*models.ModelPlan, error) {
	return loaders.ModelPlanByStatusGroup.ByStatusGroup.Load(ctx, statusGroup)
}
