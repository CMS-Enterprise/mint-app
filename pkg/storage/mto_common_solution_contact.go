package storage

import (
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCommonSolutionContactGetByCommonSolutionKeyLoader returns a list of common solution contacts associated with
func MTOCommonSolutionContactGetByCommonSolutionKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonSolutionKey) ([]*models.MTOCommonSolutionContact, error) {
	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.CollectionGetByCommonSolutionKeyLOADER, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}
