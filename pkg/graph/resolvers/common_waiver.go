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
	return loaders.CommonWaiver.GetAll.Load(ctx, modelPlanID)
}
