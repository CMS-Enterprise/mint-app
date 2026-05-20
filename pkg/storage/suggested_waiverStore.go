package storage

import (
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// SuggestedWaiverCreate creates a new suggested_waiver row
func SuggestedWaiverCreate(np sqlutils.NamedPreparer, _ *zap.Logger, sw *models.SuggestedWaiver) (*models.SuggestedWaiver, error) {
	sw.ID = utilityuuid.ValueOrNewUUID(sw.ID)
	return sqlutils.GetProcedure[models.SuggestedWaiver](np, sqlqueries.SuggestedWaiver.Create, sw)
}

// SuggestedWaiverGetByID returns a suggested_waiver row for a given id
func SuggestedWaiverGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.SuggestedWaiver, error) {
	return sqlutils.GetProcedure[models.SuggestedWaiver](np, sqlqueries.SuggestedWaiver.GetByID, utilitysql.CreateIDQueryMap(id))
}

// SuggestedWaiverGetByModelPlanIDLoader returns all suggested_waiver rows for the given model plan ids (one-to-many)
func SuggestedWaiverGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.SuggestedWaiver, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	return sqlutils.SelectProcedure[models.SuggestedWaiver](np, sqlqueries.SuggestedWaiver.GetByModelPlanIDLoader, args)
}

// SuggestedWaiverDeleteAllByModelPlanID deletes all suggested_waiver rows for a model plan.
// Used when recalculating suggestions after a survey update.
func SuggestedWaiverDeleteAllByModelPlanID(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanID uuid.UUID) ([]*models.SuggestedWaiver, error) {
	args := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	return sqlutils.SelectProcedure[models.SuggestedWaiver](np, sqlqueries.SuggestedWaiver.DeleteByModelPlanID, args)
}
