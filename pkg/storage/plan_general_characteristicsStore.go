package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_general_characteristics/create.sql
var planGeneralCharacteristicsCreateSQL string

//go:embed SQL/plan_general_characteristics/update.sql
var planGeneralCharacteristicsUpdateSQL string

//go:embed SQL/plan_general_characteristics/get_by_id.sql
var planGeneralCharacteristicsGetByIDSQL string

//go:embed SQL/plan_general_characteristics/get_by_model_plan_id_LOADER.sql
var planGeneralCharacteristicsGetByModelPlanIDLoaderSQL string

// PlanGeneralCharacteristicsCreate creates a new plan basics
func (s *Store) PlanGeneralCharacteristicsCreate(
	logger *zap.Logger,
	gc *models.PlanGeneralCharacteristics,
) (*models.PlanGeneralCharacteristics, error) {

	gc.ID = utilityUUID.ValueOrNewUUID(gc.ID)

	gc.ModifiedBy = nil
	gc.ModifiedDts = nil
	err := s.db.Get(gc, planGeneralCharacteristicsCreateSQL, gc)
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

	err := s.db.Get(gc, planGeneralCharacteristicsUpdateSQL, gc)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, gc)
	}

	return gc, nil
}

// PlanGeneralCharacteristicsGetByID returns the plan general characteristics for a given id
func (s *Store) PlanGeneralCharacteristicsGetByID(
	logger *zap.Logger,
	id uuid.UUID,
) (*models.PlanGeneralCharacteristics, error) {

	gc := models.PlanGeneralCharacteristics{}

	err := s.db.Get(&gc, planGeneralCharacteristicsGetByIDSQL, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &gc, nil
}

// PlanGeneralCharacteristicsGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanGeneralCharacteristicsGetByModelPlanIDLOADER(
	logger *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanGeneralCharacteristics, error) {

	var genCharSlice []*models.PlanGeneralCharacteristics
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	// This returns more than one
	err := s.db.Select(&genCharSlice, planGeneralCharacteristicsGetByModelPlanIDLoaderSQL, arg)
	if err != nil {
		return nil, err
	}

	return genCharSlice, nil
}
