package storage

import (
	_ "embed"
	"fmt"

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

	stmt, err := np.PrepareNamed(sqlqueries.PlanDataExchangeApproach.Create)
	if err != nil {
		return nil, fmt.Errorf("error preparing named statement: %w", err)
	}
	defer stmt.Close()

	approach.ModifiedBy = nil
	approach.ModifiedDts = nil

	err = stmt.Get(approach, approach)
	if err != nil {
		return nil, fmt.Errorf("error getting plan data exchange approach: %w", err)
	}

	return approach, nil
}

// PlanDataExchangeApproachUpdate updates the plan data exchange approach for a given id
func PlanDataExchangeApproachUpdate(np sqlutils.NamedPreparer, logger *zap.Logger, approach *models.PlanDataExchangeApproach) (*models.PlanDataExchangeApproach, error) {

	return sqlutils.GetProcedure[models.PlanDataExchangeApproach](np, sqlqueries.PlanDataExchangeApproach.Update, approach)

}

// PlanDataExchangeApproachGetByID returns the plan data exchange approach for a given id
func PlanDataExchangeApproachGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.PlanDataExchangeApproach, error) {

	return sqlutils.GetProcedure[models.PlanDataExchangeApproach](np, sqlqueries.PlanDataExchangeApproach.GetByID, utilitysql.CreateIDQueryMap(id))

}

// PlanDataExchangeApproachGetByModelPlanID returns the plan data exchange approach for a given model plan id
func PlanDataExchangeApproachGetByModelPlanID(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanID uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return sqlutils.GetProcedure[models.PlanDataExchangeApproach](np, sqlqueries.PlanDataExchangeApproach.GetByModelPlanID, utilitysql.CreateModelPlanIDQueryMap(modelPlanID))

}
