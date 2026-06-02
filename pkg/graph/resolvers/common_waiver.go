package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// GetAllCommonWaivers returns all common waivers via dataloader
func GetAllCommonWaivers(ctx context.Context) ([]*models.CommonWaiver, error) {
	return loaders.CommonWaiver.GetAll.Load(ctx, nil)
}

// CommonWaiverGetByID returns a common waiver by ID via dataloader
func CommonWaiverGetByID(ctx context.Context, id uuid.UUID) (*models.CommonWaiver, error) {
	return loaders.CommonWaiver.ByID.Load(ctx, id)
}
