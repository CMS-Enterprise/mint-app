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

// MTOMilestoneCreateCustom uses the provided information to create a new Custom MTO Milestone
func MTOMilestoneCreateCustom(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	name string,
	modelPlanID uuid.UUID,
	mtoCategoryID *uuid.UUID,
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// A custom milestone never has a CommonMilestoneKey, so pass in `nil`
	milestone := models.NewMTOMilestone(principalAccount.ID, &name, nil, modelPlanID, mtoCategoryID)

	err := BaseStructPreCreate(logger, milestone, principal, store, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneCreate(store, logger, milestone)
}

// MTOMilestoneCreateCommon uses the provided information to create a new Custom MTO Milestone
func MTOMilestoneCreateCommon(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	modelPlanID uuid.UUID,
	commonMilestoneKey models.MTOCommonMilestoneKey,
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// TODO Build a query (loader? transaction?) to do the following
	// 1) Find the Common Milestone object in the DB
	// 2) Determine if a Category Exists for this Model Plan that has the same name as the one configured for the Common Milestone
	// 3) If not, create that new category

	// A common milestone never has a name (since it comes from the Common Milestone itself), so pass in `nil`
	// TODO: Update category ID based on query from above
	milestone := models.NewMTOMilestone(principalAccount.ID, nil, &commonMilestoneKey, modelPlanID, nil)

	err := BaseStructPreCreate(logger, milestone, principal, store, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneCreate(store, logger, milestone)
}

// MTOMilestoneUpdate updates the name of MTOMilestone or SubMilestone
func MTOMilestoneUpdate(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOMilestoneGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO Milestone. Err %w", err)
	}

	// Check access and apply changes
	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneUpdate(store, logger, existing)
}

// MTOMilestoneGetByModelPlanIDLOADER implements resolver logic to get all MTO milestones by a model plan ID using a data loader
func MTOMilestoneGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOMilestone, error) {
	return loaders.MTOMilestone.ByModelPlanID.Load(ctx, modelPlanID)
}

// MTOMilestoneGetByModelPlanIDAndCategoryIDLOADER implements resolver logic to get all MTO milestones by a model plan ID and MTO category ID using a data loader
func MTOMilestoneGetByModelPlanIDAndCategoryIDLOADER(ctx context.Context, modelPlanID uuid.UUID, mtoCategoryID uuid.UUID) ([]*models.MTOMilestone, error) {
	return loaders.MTOMilestone.ByModelPlanIDAndMTOCategoryID.Load(ctx,
		storage.MTOMilestoneByModelPlanAndCategoryKey{
			ModelPlanID:   modelPlanID,
			MTOCategoryID: mtoCategoryID,
		})
}
