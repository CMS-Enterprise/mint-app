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
	return sqlutils.SelectProcedure[models.CommonWaiver](np, sqlqueries.CommonWaiver.GetByModelPlanIDLoader, map[string]interface{}{})
}

// CommonWaiverGetByModelPlanIDLoader returns the common waivers for a slice of model plan ids
// It casts a nil model plain id to UUID.nil.
// If model plan id is provided, it will provide contextual information such as will_use_waiver, not_using_reason, and suggested_waiver_id. If not, those fields will be null/zero value.
func CommonWaiverGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.CommonWaiver, error) {
	args := map[string]any{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.CommonWaiver](np, sqlqueries.CommonWaiver.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

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
