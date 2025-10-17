package resolvers

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// ModelPlansByComponentGroupLOADER implements resolver logic to get model plans by component group using a data loader
func ModelPlansByComponentGroupLOADER(ctx context.Context, componentGroup models.ComponentGroup) ([]*models.ModelPlanAndGroup, error) {
	return loaders.ModelPlanAndGroup.ByComponentGroup.Load(ctx, componentGroup)
}
