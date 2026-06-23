package storage

import (
	"fmt"

	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// WaiverUpsert creates the waiver row if it does not exist, otherwise updates
// will_use_waiver and not_using_reason. Used by the bulk updateSelectedWaivers mutation.
func WaiverUpsert(np sqlutils.NamedPreparer, _ *zap.Logger, waiver *models.Waiver) (*models.Waiver, error) {
	waiver.ID = utilityuuid.ValueOrNewUUID(waiver.ID)
	return sqlutils.GetProcedure[models.Waiver](np, sqlqueries.Waiver.Upsert, waiver)
}

// WaiverUpsertCollection inserts or updates a collection of waiver rows in a single SQL statement.
// Accepts a JSON array via JSON_TO_RECORDSET; intended to be called within a transaction.
func WaiverUpsertCollection(np sqlutils.NamedPreparer, _ *zap.Logger, waivers []*models.Waiver) ([]*models.Waiver, error) {
	mapSlice := make([]map[string]interface{}, 0, len(waivers))
	for _, w := range waivers {
		w.ID = utilityuuid.ValueOrNewUUID(w.ID)
		wMap, err := models.StructToMap(*w)
		if err != nil {
			return nil, fmt.Errorf("issue serializing waiver collection: %w", err)
		}
		mapSlice = append(mapSlice, wMap)
	}

	jsonWaivers, err := models.MapArrayToJSONArray(mapSlice)
	if err != nil {
		return nil, fmt.Errorf("issue converting waiver collection to JSON: %w", err)
	}

	stmt, err := np.PrepareNamed(sqlqueries.Waiver.UpsertCollection)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var results []*models.Waiver
	if err := stmt.Select(&results, map[string]interface{}{"paramTableJSON": jsonWaivers}); err != nil {
		return nil, err
	}
	return results, nil
}

// WaiverGetByModelPlanIDLoader returns ALL waivers for the given model plan ids (one-to-many).
func WaiverGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.Waiver, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	res, err := sqlutils.SelectProcedure[models.Waiver](np, sqlqueries.Waiver.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return res, nil
}
