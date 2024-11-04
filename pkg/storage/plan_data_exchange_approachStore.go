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

// PlanDataExchangeApproachCreate creates a new plan data exchange approach
func PlanDataExchangeApproachCreate(np sqlutils.NamedPreparer, _ *zap.Logger, approach *models.PlanDataExchangeApproach) (*models.PlanDataExchangeApproach, error) {
	approach.ID = utilityuuid.ValueOrNewUUID(approach.ID)
	return sqlutils.GetProcedure[models.PlanDataExchangeApproach](np, sqlqueries.PlanDataExchangeApproach.Create, approach)
}

// PlanDataExchangeApproachUpdate updates the plan data exchange approach for a given id
func PlanDataExchangeApproachUpdate(np sqlutils.NamedPreparer, logger *zap.Logger, approach *models.PlanDataExchangeApproach) (*models.PlanDataExchangeApproach, error) {
	return sqlutils.GetProcedure[models.PlanDataExchangeApproach](np, sqlqueries.PlanDataExchangeApproach.Update, approach)
}

// PlanDataExchangeApproachGetByID returns the plan data exchange approach for a given id
func PlanDataExchangeApproachGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return sqlutils.GetProcedure[models.PlanDataExchangeApproach](np, sqlqueries.PlanDataExchangeApproach.GetByID, utilitysql.CreateIDQueryMap(id))
}

// PlanDataExchangeApproachGetByModelPlanIDLoader returns the plan basics for a slice of model plan ids
func PlanDataExchangeApproachGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.PlanDataExchangeApproach, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	res, err := sqlutils.SelectProcedure[models.PlanDataExchangeApproach](np, sqlqueries.PlanDataExchangeApproach.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return res, nil
}
