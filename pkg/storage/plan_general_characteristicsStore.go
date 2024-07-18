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

// PlanGeneralCharacteristicsCreate creates a new plan basics
func (s *Store) PlanGeneralCharacteristicsCreate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	gc *models.PlanGeneralCharacteristics,
) (*models.PlanGeneralCharacteristics, error) {

	gc.ID = utilityuuid.ValueOrNewUUID(gc.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanGeneralCharacteristics.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}
	defer stmt.Close()

	gc.ModifiedBy = nil
	gc.ModifiedDts = nil

	err = stmt.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}

	return gc, nil
}

// PlanGeneralCharacteristicsUpdate updates the plan general characteristics for a given id
func (s *Store) PlanGeneralCharacteristicsUpdate(
	logger *zap.Logger,
	gc *models.PlanGeneralCharacteristics,
) (*models.PlanGeneralCharacteristics, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanGeneralCharacteristics.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, gc)
	}
	defer stmt.Close()

	err = stmt.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, gc)
	}

	return gc, nil
}

// PlanGeneralCharacteristicsGetByID returns the plan general characteristics for a given id
func (s *Store) PlanGeneralCharacteristicsGetByID(
	_ *zap.Logger,
	id uuid.UUID,
) (*models.PlanGeneralCharacteristics, error) {

	gc := models.PlanGeneralCharacteristics{}

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanGeneralCharacteristics.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&gc, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &gc, nil
}

// PlanGeneralCharacteristicsGetByModelPlanIDLOADER returns the plan
// GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanGeneralCharacteristicsGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanGeneralCharacteristics, error) {

	var genCharSlice []*models.PlanGeneralCharacteristics

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanGeneralCharacteristics.GetByModelPlanIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&genCharSlice, arg) // This returns more than one

	if err != nil {
		return nil, err
	}

	return genCharSlice, nil
}
