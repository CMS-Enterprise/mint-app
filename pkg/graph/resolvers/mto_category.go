package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCategoryCreate uses the provided information to create a new mto category
func MTOCategoryCreate(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	name string,
	modelPlanID uuid.UUID,
	parentID *uuid.UUID,
) (*models.MTOCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	category := models.NewMTOCategory(principalAccount.ID, name, modelPlanID, parentID)

	err := BaseStructPreCreate(logger, category, principal, store, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOCategoryCreate(store, logger, category)
}

// MTOCategoryGetByModelPlanIDLOADER implements resolver logic to get Plan Discussion by a model plan ID using a data loader
func MTOCategoryGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOCategory, error) {
	dbCategories, err := loaders.MTOCategory.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbCategories, models.MTOUncategorized(modelPlanID, nil)), nil
}

func MTOSubcategoryGetByParentIDLoader(ctx context.Context, modelPlanID uuid.UUID, parentID uuid.UUID) ([]*models.MTOSubcategory, error) {
	dbCategories, err := loaders.MTOSubcategory.ByParentID.Load(ctx, parentID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbCategories, models.MTOUncategorizedSubcategory(modelPlanID, &parentID)), nil
}
