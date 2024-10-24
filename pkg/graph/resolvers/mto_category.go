package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCategoryGetByModelPlanIDLOADER implements resolver logic to get Plan Discussion by a model plan ID using a data loader
func MTOCategoryGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOCategory, error) {
	dbCategories, err := loaders.MTOCategory.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbCategories, models.MTOUncategorized(modelPlanID)), nil
}
