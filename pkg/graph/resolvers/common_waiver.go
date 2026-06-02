package resolvers

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// GetAllCommonWaivers returns all common waivers via dataloader
func GetAllCommonWaivers(ctx context.Context) ([]*models.CommonWaiver, error) {
	return loaders.CommonWaiver.GetAll.Load(ctx, nil)
}
