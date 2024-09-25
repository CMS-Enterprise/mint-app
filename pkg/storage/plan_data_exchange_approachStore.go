package storage

import (
	_ "embed"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitysql"
	"github.com/cmsgov/mint-app/pkg/shared/utilityuuid"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
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

	err = stmt.Get(&approach, utilitysql.CreateIDQueryMap(modelPlanID))

	if err != nil {
		return nil, err
	}
	return &approach, nil
}

// PlanDataExchangeApproachDelete deletes a plan data exchange approach by id
func (s *Store) PlanDataExchangeApproachDelete(_ *zap.Logger, id uuid.UUID) error {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDataExchangeApproach.Delete)
	if err != nil {
		return fmt.Errorf("error preparing named statement: %w", err)
	}
	defer stmt.Close()

	arg := utilitysql.CreateIDQueryMap(id)

	_, err = stmt.Exec(arg)
	if err != nil {
		return fmt.Errorf("error executing statement: %w", err)
	}

	return nil
}
