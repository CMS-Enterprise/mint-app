package resolvers

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func GetMTOCommonSolutionModelUsageByCommonSolutionKeyLOADER(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, solutionKey models.MTOCommonSolutionKey) ([]*models.MTOCommonSolutionModelUsage, error) {
	if principal == nil {
		return nil, fmt.Errorf("principal is nil")
	}
	models, err := loaders.MTOCommonSolutionModelUsage.Load(ctx, solutionKey)
	if err != nil {
		return nil, err
	}
	if models == nil {
		return nil, fmt.Errorf("models are nil")
	}
	return models, nil
}
