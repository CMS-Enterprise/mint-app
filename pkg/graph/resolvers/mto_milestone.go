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

// MTOMilestoneCreate uses the provided information to create a new mto Milestone
func MTOMilestoneCreate(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	name *string,
	commonMilestoneKey *models.CommonMilestoneKey,
	modelPlanID uuid.UUID,
	mtoCategoryID *uuid.UUID,
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	Milestone := models.NewMTOMilestone(principalAccount.ID, name, commonMilestoneKey, modelPlanID, mtoCategoryID)

	err := BaseStructPreCreate(logger, Milestone, principal, store, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneCreate(store, logger, Milestone)
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

	// Just check access, don't apply changes here
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
