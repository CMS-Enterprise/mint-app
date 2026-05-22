package storage

import (
	_ "embed"

	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CommonWaiverGetAll returns all rows from the common_waiver table
func CommonWaiverGetAll(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.CommonWaiver, error) {
	return sqlutils.SelectProcedure[models.CommonWaiver](np, sqlqueries.CommonWaiver.GetAll, map[string]interface{}{})
}

// CommonWaiverGetByIDLoader returns the common waivers for a slice of ids
func CommonWaiverGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.CommonWaiver, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	res, err := sqlutils.SelectProcedure[models.CommonWaiver](np, sqlqueries.CommonWaiver.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}
	return res, nil
}
