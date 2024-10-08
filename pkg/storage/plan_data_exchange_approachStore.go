package storage

import (
	_ "embed"
	"fmt"

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
func (s *Store) PlanDataExchangeApproachCreate(np sqlutils.NamedPreparer, logger *zap.Logger, approach *models.PlanDataExchangeApproach) (*models.PlanDataExchangeApproach, error) {

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
func (s *Store) PlanDataExchangeApproachUpdate(logger *zap.Logger, approach *models.PlanDataExchangeApproach) (*models.PlanDataExchangeApproach, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDataExchangeApproach.Update)
	if err != nil {
		return nil, fmt.Errorf("error preparing named statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.Get(approach, approach)
	if err != nil {
		return nil, fmt.Errorf("error getting plan data exchange approach: %w", err)
	}

	return approach, nil
}

// PlanDataExchangeApproachGetByID returns the plan data exchange approach for a given id
func (s *Store) PlanDataExchangeApproachGetByID(_ *zap.Logger, id uuid.UUID) (*models.PlanDataExchangeApproach, error) {

	approach := models.PlanDataExchangeApproach{}

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDataExchangeApproach.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&approach, utilitysql.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}
	return &approach, nil
}

// PlanDataExchangeApproachGetByModelPlanID returns the plan data exchange approach for a given model plan id
func (s *Store) PlanDataExchangeApproachGetByModelPlanID(_ *zap.Logger, modelPlanID uuid.UUID) (*models.PlanDataExchangeApproach, error) {

	approach := models.PlanDataExchangeApproach{}

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDataExchangeApproach.GetByModelPlanID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&approach, utilitysql.CreateModelPlanIDQueryMap(modelPlanID))
	if err != nil {
		return nil, err
	}

	return &approach, nil
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
