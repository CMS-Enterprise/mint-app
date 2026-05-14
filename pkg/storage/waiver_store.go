package storage

import (
	_ "embed"

	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// WaiverCreate creates a new waiver row.
// TODO (MINT-3718): Call this when creating waivers from suggested waivers once that logic is implemented.
func WaiverCreate(np sqlutils.NamedPreparer, _ *zap.Logger, waiver *models.Waiver) (*models.Waiver, error) {
	waiver.ID = utilityuuid.ValueOrNewUUID(waiver.ID)
	return sqlutils.GetProcedure[models.Waiver](np, sqlqueries.Waiver.Create, waiver)
}

// WaiverGetByID returns a waiver row for a given id
func WaiverGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.Waiver, error) {
	return sqlutils.GetProcedure[models.Waiver](np, sqlqueries.Waiver.GetByID, utilitysql.CreateIDQueryMap(id))
}

// WaiverUpdate updates a waiver row for a given id
func WaiverUpdate(np sqlutils.NamedPreparer, _ *zap.Logger, waiver *models.Waiver) (*models.Waiver, error) {
	return sqlutils.GetProcedure[models.Waiver](np, sqlqueries.Waiver.Update, waiver)
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
