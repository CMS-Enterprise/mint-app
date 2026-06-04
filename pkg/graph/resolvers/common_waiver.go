package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// GetAllCommonWaivers returns all common waivers via dataloader
// it takes an optional modelPlanID to provide contextual information about the waivers in relation to a model plan
func GetAllCommonWaivers(ctx context.Context, modelPlanID *uuid.UUID) ([]*models.CommonWaiver, error) {
	// Translate a nil key to UUID nil, as we need a primitive type for translating results later
	var key uuid.UUID
	if modelPlanID != nil {
		key = *modelPlanID
	}
	return loaders.CommonWaiver.GetAllByModelPlanID.Load(ctx, key)
}
