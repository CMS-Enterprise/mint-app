package storage

import (
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// GetMTOCommonSolutionModelUsageByCommonSolutionKey returns a list of common solution contacts associated with
func GetMTOCommonSolutionModelUsageByCommonSolutionKey(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonSolutionKey) ([]*models.MTOCommonSolutionModelUsage, error) {
	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionModelUsage](np, sqlqueries.MTOCommonSolutionModelUsage.GetByCommonSolutionKey, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}
