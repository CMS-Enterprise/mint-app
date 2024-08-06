package storage

import (
	_ "embed"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitysql"
	"github.com/cmsgov/mint-app/pkg/shared/utilityuuid"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

// PlanBasicsCreate creates a new plan basics
func (s *Store) PlanBasicsCreate(np sqlutils.NamedPreparer, logger *zap.Logger, basics *models.PlanBasics) (*models.PlanBasics, error) {

	basics.ID = utilityuuid.ValueOrNewUUID(basics.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanBasics.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, basics)
	}
	defer stmt.Close()

	basics.ModifiedBy = nil
	basics.ModifiedDts = nil

	err = stmt.Get(basics, basics)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, basics)
	}

	return basics, nil
}

// PlanBasicsUpdate updates the plan basics for a given id
func (s *Store) PlanBasicsUpdate(logger *zap.Logger, plan *models.PlanBasics) (*models.PlanBasics, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanBasics.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, plan)
	}
	defer stmt.Close()

	err = stmt.Get(plan, plan)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, plan)
	}

	return plan, nil
}

// PlanBasicsGetByID returns the plan basics for a given id
func (s *Store) PlanBasicsGetByID(_ *zap.Logger, id uuid.UUID) (*models.PlanBasics, error) {

	plan := models.PlanBasics{}

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanBasics.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&plan, utilitysql.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}
	return &plan, nil
}

// PlanBasicsGetByModelPlanIDLOADER returns the plan basics for a slice of model plan ids
func (s *Store) PlanBasicsGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanBasics, error) {

	var basicSlice []*models.PlanBasics // TODO: use new data loader query instead.

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanBasics.GetByModelPlanIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&basicSlice, arg) // This returns more than one

	if err != nil {
		return nil, err
	}

	return basicSlice, nil
}
