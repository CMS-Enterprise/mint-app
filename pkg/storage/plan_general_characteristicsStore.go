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

//go:embed SQL/plan_general_characteristics/get_by_model_plan_id.sql
var planGeneralCharacteristicsGetByModelPlanIDSQL string

//go:embed SQL/plan_general_characteristics/get_by_model_plan_id_LOADER.sql
var planGeneralCharacteristicsGetByModelPlanIDLoaderSQL string

// PlanGeneralCharacteristicsCreate creates a new plan basics
func (s *Store) PlanGeneralCharacteristicsCreate(logger *zap.Logger, gc *models.PlanGeneralCharacteristics) (*models.PlanGeneralCharacteristics, error) {
	gc.ID = utilityUUID.ValueOrNewUUID(gc.ID)

	statement, err := s.db.PrepareNamed(planGeneralCharacteristicsCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}

	gc.ModifiedBy = nil
	gc.ModifiedDts = nil
	err = statement.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}

	return gc, nil
}

// PlanGeneralCharacteristicsUpdate updates the plan general characteristics for a given id
func (s *Store) PlanGeneralCharacteristicsUpdate(logger *zap.Logger, gc *models.PlanGeneralCharacteristics) (*models.PlanGeneralCharacteristics, error) {
	statement, err := s.db.PrepareNamed(planGeneralCharacteristicsUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, gc)
	}

	err = statement.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, gc)
	}

	return gc, nil
}

// PlanGeneralCharacteristicsGetByID returns the plan general characteristics for a given id
func (s *Store) PlanGeneralCharacteristicsGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanGeneralCharacteristics, error) {
	gc := models.PlanGeneralCharacteristics{}

	statement, err := s.db.PrepareNamed(planGeneralCharacteristicsGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&gc, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &gc, nil
}

// PlanGeneralCharacteristicsGetByModelPlanID returns the plan general characteristics for a given model plan id
func (s *Store) PlanGeneralCharacteristicsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) (*models.PlanGeneralCharacteristics, error) {
	gc := models.PlanGeneralCharacteristics{}

	statement, err := s.db.PrepareNamed(planGeneralCharacteristicsGetByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = statement.Get(&gc, arg)

	if err != nil {
		return nil, err
	}

	return &gc, nil
}

// PlanGeneralCharacteristicsGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanGeneralCharacteristicsGetByModelPlanIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.PlanGeneralCharacteristics, error) {
	genCharSlice := []*models.PlanGeneralCharacteristics{}

	stmt, err := s.db.PrepareNamed(planGeneralCharacteristicsGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&genCharSlice, arg) //this returns more than one

	if err != nil {
		return nil, err
	}

	return genCharSlice, nil
}
